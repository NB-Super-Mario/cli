import { resolve, join } from 'path';
import Config from 'webpack-chain';

import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ParallelUglifyPlugin from 'webpack-parallel-uglify-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import HtmlWebpackIncludeSiblingChunksPlugin from 'html-webpack-include-sibling-chunks-plugin';
import CompressionWebpackPlugin from 'compression-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import ComboPlugin from 'html-webpack-combo-plugin';
import debug from 'debug';
import getConfig from './base';

import { babelOpts } from './util';

import conf from './config';

const log = debug('mario-cli:prod');

const getProdConfig = (opts: any = {}): Config => {
  log(opts);
  const cwd = conf.cwd || process.cwd();

  const pkg = require(resolve(cwd, 'package.json'));
  const src = conf.src || resolve(cwd, 'src');

  const theme = require(resolve(cwd, 'theme'));

  const prodConfig: Config = getConfig({
    isProd: opts.isProd,
    cwd,
    src,
    entry: 'src/scripts/entry',
    dllOutput: resolve(src, 'dll'),
  });

  prodConfig.mode('production');
  prodConfig.output
    .path(resolve(cwd, 'target', `${pkg.name}`))
    .filename(
      `${conf.prefixTarget}scripts/[name]${
        conf.build.chunkhash ? '.[chunkhash]' : ''
      }.js`
    )
    .chunkFilename(
      `${conf.prefixTarget}scripts/[chunkhash]${
        conf.build.chunkhash ? '.[chunkhash]' : ''
      }.js`
    )
    .publicPath(conf.domain);

  prodConfig.module
    .rule('js')
    .test(/\.js$/)
    .exclude.add(join(cwd, 'node_modules'))
    .end()
    .include.add(src)
    .end()
    .use('babel-loader')
    .loader(require.resolve('babel-loader'))
    .options(babelOpts)
    .end();

  prodConfig.plugin('define').use<any>(webpack.DefinePlugin, conf.definePlugin);

  prodConfig.plugin('css').use(MiniCssExtractPlugin, [
    {
      filename: `${conf.prefixTarget}css/[name].css`,
      allChunks: true,
      ignoreOrder: true,
    },
  ]);

  prodConfig.module
    .rule('css')
    .test(/^((?!\.module).)*(css|less)$/)
    .use('mini-css')
    .loader(MiniCssExtractPlugin.loader)
    .options({
      publicPath: conf.domain,
    })
    .end()
    .use('css-loader')
    .loader('css-loader')
    .end()
    .use('postcss-loader')
    .loader('postcss-loader')
    .end()
    .use('less-loader')
    .loader('less-loader')
    .options({
      javascriptEnabled: true,
      modifyVars: theme,
    });

  prodConfig.module
    .rule('css-module')
    .test(/\.module\.(css|less)$/)
    .use('mini-css')
    .loader(MiniCssExtractPlugin.loader)
    .options({
      publicPath: conf.domain,
    })
    .end()
    .use('css-loader')
    .loader('css-loader')
    .options({
      modules: true,
    })
    .end()
    .use('postcss-loader')
    .loader('postcss-loader')
    .end()
    .use('less-loader')
    .loader('less-loader')
    .options({
      javascriptEnabled: true,
      modifyVars: theme,
    });

  const entris = prodConfig.entryPoints.values();

  prodConfig.optimization
    .runtimeChunk(true)
    .namedModules(true)
    .splitChunks({
      cacheGroups: {
        styles: {
          name: 'commons',
          test: /^((?!\.module).)*(css|less|sass|scss)$/,
          chunks:
            /* conf.isAntd
            ? chunk => {
                // 这里的name 可以参考在使用`webpack-ant-icon-loader`时指定的`chunkName`
                return chunk.name !== 'antd-icons';
              }
            : */ 'all',
          minChunks: entris.length,
          reuseExistingChunk: true,
          enforce: true,
          minSize: 0,
        },
        js: {
          name: 'commons',
          test: /\.(js|tsx?)$/,
          chunks:
            /* conf.isAntd
            ? chunk => {
                // 这里的name 可以参考在使用`webpack-ant-icon-loader`时指定的`chunkName`
                return chunk.name !== 'antd-icons';
              }
            : */ 'initial', //  设置 all import() split 无效
          minChunks: entris.length,
          minSize: 0,
        },
      },
    })
    .occurrenceOrder(true)
    .noEmitOnErrors(true)
    .concatenateModules(true);

  prodConfig
    .plugin('htmlWebpackIncludeSiblingChunks')
    .use(HtmlWebpackIncludeSiblingChunksPlugin)
    .end();

  prodConfig.plugin('htmlWebpackIncludeSiblingChunks').before('html-plugin');

  prodConfig.plugin('parallelUglifyPlugin').use(ParallelUglifyPlugin, [
    {
      cacheDir: '.cache/',
      uglifyJS: {
        output: {
          comments: false,
        },
        compress: {
          drop_console: true,
        },
      },
    },
  ]);
  prodConfig.plugin('optimizeCssAssetsPlugin').use(OptimizeCssAssetsPlugin);

  if (conf.build.productionGzip) {
    prodConfig
      .plugin('compressionWebpackPlugin')
      .use(CompressionWebpackPlugin, [
        {
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: /\.(js|css|html|svg)$/,
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets: false,
        },
      ]);
  }
  if (conf.build.bundleAnalyzerReport) {
    prodConfig.plugin('bundleAnalyzerPlugin').use(BundleAnalyzerPlugin);
  }
  if (conf.build.combo) {
    log(`conf.build.combo:${conf.build.combo}`);
    log(`conf.domain:${conf.domain} conf.hostname:${conf.hostname}`);
    prodConfig.plugin('comboPlugin').use(ComboPlugin, [
      {
        baseUri: `${conf.domain}??`,
        splitter: ',',
        async: false,
        replaceCssDomain: conf.hostname,
        replaceScriptDomain: conf.hostname,
      },
    ]);
  }

  return prodConfig;
};
export default getProdConfig;
