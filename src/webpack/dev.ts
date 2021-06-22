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
import ReactRefreshTypeScript from 'react-refresh-typescript';
// import { address } from 'ip';
import conf from './config';

import getConfig from './base';
import { getBabelOpts } from './util';

// const ip = address();
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
    target: 'web',
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
          test: /\.jsx?$/,
          exclude: [
            join(cwd, 'node_modules'),
            join(__dirname, '../../node_modules'),
          ],
          use: [
            {
              loader: 'babel-loader',
              options: getBabelOpts(true),
            },
          ],
        },

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
          test: /\.tsx?$/,
          exclude: [join(cwd, 'node_modules'), join(cwd, 'src', 'dll')],
          include: [join(cwd, 'src')],
          use: [
            {
              loader: 'babel-loader',
              options: getBabelOpts(true),
            },
            {
              loader: 'ts-loader',
              options: {
                configFile: tsConfigFile,
                transpileOnly: true,
                getCustomTransformers: () => ({
                  before: [
                    ReactRefreshTypeScript(),
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
      new ReactRefreshWebpackPlugin(/* {
        overlay: {
          sockIntegration: 'whm',
          // sockHost: `ws://10.101.192.159:9009`,
        },
      } */),
    ].filter(Boolean),
    devtool: 'inline-cheap-module-source-map',
  });
};

export default getDevConfig;
