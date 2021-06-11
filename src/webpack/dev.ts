import { resolve, relative } from 'path';

import { Configuration, DefinePlugin } from 'webpack';
import { merge } from 'webpack-merge';
import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin';
import debug from 'debug';
import conf from './config';

import getConfig from './base';

// import HappyPack = require('happypack');
const log = debug('mario-cli:dev');
const getDevConfig = (): Configuration => {
  const cwd = conf.cwd || process.cwd();

  const src = conf.src || resolve(cwd, 'src');

  const theme = require(resolve(cwd, 'theme'));
  log(`theme:${JSON.stringify(theme)}`);
  // const happyThreadPool = HappyPack.ThreadPool({ size: 5 });
  const devConfig: Configuration = getConfig({
    config: {
      domain: conf.domain,
    },
    cwd,
    src,
    entry: 'src/scripts/entry',
    dllOutput: resolve(src, 'dll'),
  });
  return merge(devConfig, {
    mode: 'development',

    output: {
      filename: `scripts/[name].js`,
      chunkFilename: `scripts/[name].js`,
      publicPath: conf.domain || '/',
      devtoolModuleFilenameTemplate: info => {
        return relative(cwd, info.absoluteResourcePath).replace(/\\/g, '/');
      },
      sourceMapFilename: `[file].map`,
    },
    resolve: {
      alias: {
        // 'react-dom': '@hot-loader/react-dom',
      },
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: 'style-loader',
              options: {
                // sourceMap: true
                // singleton: true
              },
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
            /* {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  sourceMap: 'inline',
                },
              },
            }, */
          ],
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: 'style-loader',
              options: {
                // sourceMap: true
                // singleton: true
              },
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                  modifyVars: theme,
                  strictMath: false,
                  noIeCompat: true,
                },
                sourceMap: true,
              },
            },
          ],
        },
        {
          test: /\.js$/,
          include: [src],
          use: [
            {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                plugins: ['react-hot-loader/babel'],
                // importLoaders: 1
                // minimize: true ,
                sourceMap: true,
                cacheDirectory: false,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new DefinePlugin(
        Object.fromEntries(conf.definePlugin.map(e => [e.key, e.value]))
      ),
      new HtmlWebpackHarddiskPlugin({
        outputPath: '__build',
      }),
    ],
    // devtool: 'eval-source-map',
  });
};

export default getDevConfig;
