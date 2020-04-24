import Config from 'webpack-chain';
import webpack from 'webpack';
import { join, resolve, relative } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import debug from 'debug';
import fs from 'fs';

import { EOL } from 'os';

import conf from './config';

import { babelOpts } from './util';

const tsImportPluginFactory = require('ts-import-plugin');

const log = debug('mario-cli:base');

const getConfig = (opts: any = {}): Config => {
  const cwd = opts.cwd || process.cwd();
  // Instantiate the configuration with a new API
  const config = new Config();
  config.context(cwd);

  // webpack入口文件

  const entryDir = resolve(cwd, opts.entry || 'src/scripts/entry');
  const names = fs.readdirSync(entryDir);

  names.forEach(name => {
    const m = name.match(/(.+)\.(js|tsx?)?$/);

    const fileName = m ? m[1] : '';
    if (fileName) {
      const entryPath = fileName ? resolve(entryDir, name) : '';

      const entry = config.entry(fileName);
      entry.add(entryPath);
    }
  });
  config.end();

  const pages = fs.readdirSync(opts.src);
  let index = 0;
  pages.forEach(filename => {
    const m = filename.match(/(.+)\.html$/);
    if (m) {
      const locConfig: any = {
        template: resolve(opts.src, filename),
        hash: true,
        filename: `${filename}`,
        // eslint-disable-next-line @typescript-eslint/camelcase
        base_home: `${conf.domain}${conf.prefixTarget}`,
        timestamp: `${new Date().getTime()}`,
        alwaysWriteToDisk: conf.alwaysWriteToDisk,
        minify: conf.minify,
        ...conf.otherHtmlConfig,
        /* minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
          // more options:
          // https://github.com/kangax/html-minifier#options-quick-reference
        } */
      };

      if (config.entryPoints.has(m[1])) {
        locConfig.inject = 'body';
        locConfig.chunks = [m[1]];
      }

      log(`locConfig:${JSON.stringify(locConfig)}`);
      config
        .plugin(index === 0 ? `html-plugin` : `html-${m[1]}`)
        .use(HtmlWebpackPlugin, [locConfig]); // 打包时候连同html一起打包
      index = 1;
    }
  });

  config.resolve
    // 不能设为 false，因为 tnpm 是通过 link 处理依赖，设为 false tnpm 下会有大量的冗余模块
    .set('symlinks', true)
    .modules.add('node_modules')
    .add(join(__dirname, '../../node_modules'))
    // Fix yarn global resolve problem
    .add(join(__dirname, '../../../'))
    .end()

    .extensions.merge([
      '.web.js',
      '.js',
      '.json',
      '.tsx',
      '.ts',
      '.ejs',
      '.jsx',
      '.css',
      '.png',
      '.jpg',
      '.less',
      '.scss',
      '.sass',
    ]);
  config.externals(conf.externals);
  Object.keys(conf.alias).forEach(name => {
    log(`alias:name:${name}`);
    log(`alias:item:${conf.alias[`${name}`]}`);
    config.resolve.alias.set(`${name}`, conf.alias[`${name}`]);
  });

  config.module
    .rule('js')
    .test(/\.jsx?$/)
    .include.add(cwd)
    .end()
    .exclude.add(/node_modules/)
    .end()
    .use('babel-loader')
    .loader(require.resolve('babel-loader'))
    .options(babelOpts);

  // ts module
  const tsConfigFile = opts.tsConfigFile || join(cwd, 'tsconfig.json');

  config.module
    .rule('ts')
    .test(/\.tsx?$/)
    // .use('babel-loader')
    // .loader(require.resolve('babel-loader'))
    // .options(babelOpts)
    // .end()
    .use('ts-loader')
    .loader(require.resolve('ts-loader'))
    .options({
      configFile: tsConfigFile,
      transpileOnly: true,
      getCustomTransformers: () => ({
        before: [
          tsImportPluginFactory([
            {
              libraryName: 'antd-mobile',
              libraryDirectory: 'es', // lib antd 嵌套会报错
              style: true,
            },
            {
              libraryName: 'antd',
              libraryDirectory: 'es', // lib antd 嵌套会报错
              style: true,
            },
          ]),
        ],
      }),
      // ref: https://github.com/TypeStrong/ts-loader/blob/fbed24b/src/utils.ts#L23
      errorFormatter(error, colors) {
        const messageColor =
          error.severity === 'warning' ? colors.bold.yellow : colors.bold.red;
        return (
          colors.grey('[tsl] ') +
          messageColor(error.severity.toUpperCase()) +
          (error.file === ''
            ? ''
            : messageColor(' in ') +
              colors.bold.cyan(
                `${relative(cwd, join(error.context, error.file))}(${
                  error.line
                },${error.character})`
              )) +
          EOL +
          messageColor(`      TS${error.code}: ${error.content}`)
        );
      },
      ...(opts.typescript || {}),
    });

  // Create named rules which can be modified later
  config.module
    .rule('img')
    .test(/\.(jpe?g|png|gif|svg)$/i)
    .use('url-loader')
    .loader('url-loader')

    .options({
      limit: 10000,
      minetype: 'images/jpg',
      name: `${conf.prefixTarget}img/[name]_[hash].[ext]`,
    });

  config.module
    .rule('icon')
    .test(/\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?/i)

    .use('url-loader')
    .loader('url-loader')
    .options({
      limit: 8421,
      name: `${conf.prefixTarget}fonts/[name].[ext]`,
    });

  config.plugin('copy-public').use(require('copy-webpack-plugin'), [
    [
      {
        from: opts.dllOutput,
        to: `${conf.prefixTarget}lib`,
        ignore: ['*.json'],
        debug: 'info',
        context: cwd,
      },
      {
        from: join(opts.src, 'scripts', 'lib', 'min'),
        to: `${conf.prefixTarget}lib`,
        ignore: ['*.json'],
        debug: 'info',
        context: cwd,
        flatten: true,
      },
      { from: 'src/static-res/favicon.ico', to: 'favicon.ico' },
      { from: 'src/static-res/healthCheck.html', to: 'healthCheck.html' },
      ...conf.copyRes,
    ],
  ]);

  Object.keys(conf.dllEntry).forEach(name => {
    config.plugin('dll-reference').use(webpack.DllReferencePlugin, [
      {
        context: cwd,
        manifest: require(join(opts.dllOutput, `${name}-manifest.json`)),
      },
    ]);
  });

  config
    .plugin('momentPlugin')
    .use(webpack.ContextReplacementPlugin, [
      /moment[\\/]locale$/,
      /^\.\/(zh-cn|en)$/,
    ]);
  config
    .plugin('.providePlugin')
    .use(webpack.ProvidePlugin, [conf.provideDefs]);

  return config;
};

export default getConfig;
