import { resolve, relative, join } from 'path';

import {
  Configuration,
  DefinePlugin,
  HotModuleReplacementPlugin,
} from 'webpack';
import { merge } from 'webpack-merge';
import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import debug from 'debug';
import tsImportPluginFactory from 'ts-import-plugin';
import { EOL } from 'os';
import conf from './config';

import getConfig from './base';

const ReactRefreshTypeScript = require('react-refresh-typescript');

// import HappyPack = require('happypack');
const log = debug('mario-cli:dev');

const getDevConfig = (): Configuration => {
  const cwd = conf.cwd || process.cwd();

  const src = conf.src || resolve(cwd, 'src');
  const tsConfigFile = join(cwd, 'tsconfig.json');
  log(`locConfig:${JSON.stringify(tsConfigFile)}`);
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
                plugins: ['react-refresh/babel'],
                // importLoaders: 1
                // minimize: true ,
                sourceMap: true,
                cacheDirectory: false,
              },
            },
          ],
        },
        {
          test: /\.tsx?$/,
          exclude: [join(cwd, 'node_modules'), join(cwd, 'src', 'dll')],
          include: [join(cwd, 'src')],
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
                    ReactRefreshTypeScript(),
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
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new DefinePlugin(conf.definePlugin[0]),
      new HtmlWebpackHarddiskPlugin({
        outputPath: '__build',
      }),
      new HotModuleReplacementPlugin(),
      new ReactRefreshWebpackPlugin(),
    ].filter(Boolean),
    // devtool: 'eval-source-map',
  });
};

export default getDevConfig;
