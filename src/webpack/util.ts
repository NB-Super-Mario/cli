import fs from 'fs';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { resolve, join } from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

import {
  DefinePlugin,
  DllReferencePlugin,
  EntryObject,
  WebpackPluginInstance,
} from 'webpack';
// import CompressionWebpackPlugin from 'compression-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import ComboPlugin from 'html-webpack-combo-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export const getBabelOpts = (
  isDev: boolean
): {
  [index: string]: any;
} => {
  const babelOpts = {
    sourceType: 'unambiguous',
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          targets: { browsers: ['last 2 versions'] },
          modules: 'auto',
          //  debug: true,
          useBuiltIns: 'usage',
          corejs: 2,
          exclude: [
            'transform-typeof-symbol',
            'transform-unicode-regex',
            'transform-sticky-regex',
            'transform-new-target',
            'transform-modules-umd',
            'transform-modules-systemjs',
            'transform-modules-amd',
            'transform-literals',
          ],
        },
      ],
      require.resolve('@babel/preset-react'),
    ],
    plugins: [
      require.resolve('babel-plugin-react-require'),
      require.resolve('@babel/plugin-syntax-dynamic-import'),

      require.resolve('@babel/plugin-proposal-async-generator-functions'),

      // 下面两个的顺序的配置都不能动
      [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
      [require.resolve('@babel/plugin-proposal-class-properties')],

      require.resolve('@babel/plugin-proposal-export-default-from'),

      [
        require.resolve('@babel/plugin-proposal-pipeline-operator'),
        {
          proposal: 'minimal',
        },
      ],
      require.resolve('@babel/plugin-proposal-do-expressions'),
      require.resolve('@babel/plugin-proposal-function-bind'),
      require.resolve('babel-plugin-macros'),
      [
        require.resolve('babel-plugin-import'),

        {
          style: true,
          libraryDirectory: 'es', // 不加入会出现React.createElement: type is invalid
          libraryName: 'antd-mobile',
        },
        'antd-mobile',
      ],
      [
        require.resolve('babel-plugin-import'),
        {
          style: true,
          libraryDirectory: 'es', // 不加入会出现React.createElement: type is invalid
          libraryName: 'antd',
        },
        'antd',
      ],

      // require.resolve('react-hot-loader/babel'),
    ],
    sourceMap: isDev,
    cacheDirectory: isDev,
  };
  if (isDev) babelOpts.plugins.push(require.resolve('react-refresh/babel'));
  return babelOpts;
};

/**
 * 获得webpack入口
 * @param cwd
 * @param entry
 * @returns
 */
export const getEntries = (
  cwd: string,
  entry = 'src/scripts/entry'
): EntryObject => {
  const entryDir = resolve(cwd, entry);
  const names = fs.readdirSync(entryDir);
  const map = {};

  names.forEach(name => {
    const m = /(.+)\.(js|tsx?)?$/.exec(name);
    const fileName = m ? m[1] : '';
    if (fileName) {
      const entryPath = fileName ? resolve(entryDir, name) : '';

      if (fileName) map[fileName] = entryPath;
    }
  });
  return map;
};

/**
 * html 插件
 * @param config
 * @param defaultConf
 * @param src
 * @returns
 */
export const getHtmlPlugin = (
  entry,
  defaultConf,
  src
): WebpackPluginInstance[] => {
  const plugins: WebpackPluginInstance[] = [];
  const pages = fs.readdirSync(src);
  pages.forEach(filename => {
    const m = /(.+)\.html$/.exec(filename);

    if (m) {
      // @see https://github.com/kangax/html-minifier
      const conf = {
        template: resolve(src, filename),
        // @see https://github.com/kangax/html-minifier
        // minify: {
        //     collapseWhitespace: true,
        //     removeComments: true
        // },
        hash: true,
        filename: `${filename}`,
        // eslint-disable-next-line @typescript-eslint/camelcase
        base_home: `${defaultConf.domain}${defaultConf.prefixTarget}`,
        timestamp: `${new Date().getTime()}`,
        alwaysWriteToDisk: defaultConf.alwaysWriteToDisk,
        minify: defaultConf.minify,
        ...defaultConf.otherHtmlConfig,
      };

      if (m[1] in entry) {
        conf.inject = 'body';
        conf.chunks = [m[1]];
      }
      plugins.push(new HtmlWebpackPlugin(conf)); // 打包时候连同html一起打包
    }
  });

  return plugins;
};

/**
 * dll插件
 * @param cwd
 * @param defaultConf
 * @returns
 */
export const getDllRerencePlugin = (
  cwd,
  defaultConf
): WebpackPluginInstance[] => {
  const plugins: WebpackPluginInstance[] = [];
  Object.keys(defaultConf.dllEntry).forEach(name => {
    plugins.push(
      new DllReferencePlugin({
        context: cwd,
        manifest: require(join(defaultConf.dllOutput, `${name}-manifest.json`)),
      })
    );
  });
  return plugins;
};

export const getProdPlugin = (conf): WebpackPluginInstance[] => {
  const plugins: WebpackPluginInstance[] = [];

  plugins.push(
    new DefinePlugin(
      conf.definePlugin[0]
      // Object.fromEntries(conf.definePlugin.map(e => [e.key, e.value]))
    )
  );
  plugins.push(new CleanWebpackPlugin());

  plugins.push(
    new MiniCssExtractPlugin({
      filename: `${conf.prefixTarget}css/[name].css`,
      chunkFilename: `${conf.prefixTarget}css/[name]${
        conf.build.chunkhash ? '.[chunkhash]' : ''
      }.css`,
      ignoreOrder: true,
    })
  );
  if (conf.build.productionGzip) {
    /* plugins.push(
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8,
        deleteOriginalAssets: false,
      })
    ); */
  }
  // new HtmlWebpackIncludeSiblingChunksPlugin(),
  // new OptimizeCssAssetsPlugin(),

  if (conf.build.bundleAnalyzerReport) {
    plugins.push(new BundleAnalyzerPlugin());
  }
  if (conf.build.combo) {
    plugins.push(
      ComboPlugin({
        baseUri: `${conf.domain}??`,
        splitter: ',',
        async: false,
        replaceCssDomain: conf.hostname,
        replaceScriptDomain: conf.hostname,
      })
    );
  }

  return plugins;
};
