import { resolve, relative, join } from 'path';

import { Configuration, DefinePlugin } from 'webpack';

import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin';

import conf from './config';

import getConfig from './base';

// import HappyPack = require('happypack');

const getDevConfig = (): Configuration => {
  const cwd = conf.cwd || process.cwd();

  const src = conf.src || resolve(cwd, 'src');

  const theme = require(resolve(cwd, 'theme'));

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

  return {
    ...devConfig,
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
        'react-dom': '@hot-loader/react-dom',
      },
    },
    module: {
      rules: [
        {
          test: /^((?!\.module).)*css$/,
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
              loader: 'postcss-loader',
              options: {
                sourceMap: 'inline',
              },
            },
          ],
        },
        {
          test: /\.module\.css$/,
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
              loader: 'postcss-loader',
              options: {
                sourceMap: 'inline',
              },
            },
          ],
        },
        {
          test: /\.module\.less$/,
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
                sourceMap: true,
                javascriptEnabled: true,
                modifyVars: theme,
              },
            },
          ],
        },
        {
          test: /^((?!\.module).)*less$/,
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
                sourceMap: true,
                javascriptEnabled: true,
                modifyVars: theme,
              },
            },
          ],
        },
        {
          test: /\.js$/,
          exclude: [join(cwd, 'node_modules')],
          include: [src],
          use: [
            {
              loader: 'babel-loader',
              options: {
                babelrc: true,
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
    devtool: 'cheap-module-eval-source-map',
  };

  return devConfig;
};

export default getDevConfig;
