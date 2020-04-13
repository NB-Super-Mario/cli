import { resolve, relative, join } from 'path';
import Config from 'webpack-chain';
import webpack from 'webpack';

import OpenBrowserPlugin from 'open-browser-webpack-plugin';
import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin';
// import HappyPack from 'happypack';

import conf from './config';

import getConfig from './base';
import { babelOpts } from './util';

const HappyPack = require('happypack');

const getDevConfig = (opts: any = {}): Config => {
  const cwd = conf.cwd || process.cwd();

  const src = conf.src || resolve(cwd, 'src');

  const theme = require(resolve(cwd, 'theme'));

  const happyThreadPool = HappyPack.ThreadPool({ size: 5 });
  const devConfig: Config = getConfig({
    config: {
      domain: opts.domain
    },
    cwd,
    src,
    entry: 'src/scripts/entry',
    dllOutput: resolve(src, 'dll')
  });

  devConfig.mode('development');
  devConfig.output
    .filename(`scripts/[name].js`)
    .chunkFilename(`scripts/[name].js`)
    .publicPath(opts.domain || undefined)
    .devtoolModuleFilenameTemplate(info => {
      return relative(cwd, info.absoluteResourcePath).replace(/\\/g, '/');
    })
    .sourceMapFilename(`[file].map`);

  devConfig.resolve.alias.set('react-dom', '@hot-loader/react-dom');

  devConfig.module
    .rule('css')
    .test(/\.(css)$/)
    .use('style-loader')
    .loader('style-loader')
    .options({
      // sourceMap: true
      // singleton: true
    })
    .end()
    .use('css-loader')
    .loader('css-loader')
    .options({
      sourceMap: true
    })
    .end()
    .use('postcss-loader')
    .loader('postcss-loader')
    .options({
      sourceMap: 'inline'
    });

  /* if (conf.isBootstrap) {
    devConfig.module
      .rule('scss')
      .test(/\.(s[ac]ss)$/)
      .use('style-loader')
      .loader('style-loader')
      .options({
        // sourceMap: true
        // singleton: true
      })
      .end()
      .use('css-loader')
      .loader('css-loader')
      .options({
        sourceMap: true
      })
      .end()
      .use('postcss-loader')
      .loader('postcss-loader')
      .options({
        sourceMap: 'inline'
      })
      .end()
      .use('sass-loader')
      .loader('sass-loader')
      .end();
  } */

  devConfig.module
    .rule('less')
    .test(/\.less$/)
    .use('happypack')
    .loader('happypack/loader?id=styles');

  devConfig.module
    .rule('js')
    .test(/\.js$/)
    .exclude.add(join(cwd, 'node_modules'))
    .end()
    .include.add(src)
    .end()
    .use('happypack')
    .loader('happypack/loader?id=js');

  devConfig.plugin('happypack-js').use(HappyPack, [
    {
      id: 'js',
      threadPool: happyThreadPool,
      // 3) re-add the loaders you replaced above in #1:
      loaders: [
        {
          loader: 'babel-loader',
          options: babelOpts
        }
      ]
    }
  ]);
  devConfig.plugin('happypack-styles').use(HappyPack, [
    {
      id: 'styles',
      threadPool: happyThreadPool,
      // 3) re-add the loaders you replaced above in #1:
      loaders: [
        {
          loader: 'style-loader',
          options: {
            // sourceMap: true
            //  singleton: true
          }
        },
        {
          loader: 'css-loader',
          options: {
            // importLoaders: 1
            // minimize: true ,
            sourceMap: true
          }
        },
        {
          loader: 'less-loader',
          options: {
            sourceMap: true,
            javascriptEnabled: true,
            modifyVars: theme
          }
        }
      ]
    }
  ]);

  devConfig.plugin('define').use(webpack.DefinePlugin, conf.definePlugin);

  devConfig.plugin('htmlWebpackHarddisk').use(HtmlWebpackHarddiskPlugin, [
    {
      outputPath: '__build'
    }
  ]);

  if (conf.dev.isOpenBrowser)
    devConfig
      .plugin('openBrowserPlugin')
      .use(OpenBrowserPlugin, [
        { url: `http:${conf.domain}${conf.indexPage}` }
      ]);
  devConfig.devtool('cheap-module-eval-source-map');
  return devConfig;
};

export default getDevConfig;
