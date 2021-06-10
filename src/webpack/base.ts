import {
  Configuration,
  ContextReplacementPlugin,
  ProvidePlugin,
} from 'webpack';
import { join, relative, resolve } from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import tsImportPluginFactory from 'ts-import-plugin';
import debug from 'debug';
import { EOL } from 'os';

import conf from './config';

import {
  babelOpts,
  getDllRerencePlugin,
  getEntries,
  getHtmlPlugin,
} from './util';

const log = debug('mario-cli:base');

const getBaseConfig = (opts: any = {}): Configuration => {
  const cwd = opts.cwd || process.cwd();
  const entry = getEntries(cwd, opts.entry);
  const tsConfigFile = opts.tsConfigFile || join(cwd, 'tsconfig.json');
  log(`locConfig:${JSON.stringify(tsConfigFile)}`);
  // Instantiate the configuration with a new API
  const config: Configuration = {
    context: cwd,
    entry,
    resolve: {
      symlinks: true,
      modules: [
        resolve(cwd, 'src'),
        resolve(cwd, 'node_modules'),
        join(__dirname, '../../../'),
        join(__dirname, '../../node_modules'),
      ],
      extensions: [
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
      ],
      alias: conf.alias,
    },
    externals: { ...conf.externals },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: babelOpts,
            },
          ],
        },
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
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
                    error.severity === 'warning'
                      ? colors.bold.yellow
                      : colors.bold.red;
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
              },
            },
          ],
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000,
                minetype: 'images/jpg',
                name: `${conf.prefixTarget}img/[name]_[hash].[ext]`,
              },
            },
          ],
        },
        {
          test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8421,
                name: `${conf.prefixTarget}fonts/[name].[ext]`,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      ...getDllRerencePlugin(cwd, conf),
      ...getHtmlPlugin(entry, conf, opts.src),
      new CopyWebpackPlugin([
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
      ]),
      new ContextReplacementPlugin([/moment[\\/]locale$/, /^\.\/(zh-cn|en)$/]),
      new ProvidePlugin(conf.provideDefs),
    ],
  };

  return config;
};

export default getBaseConfig;
