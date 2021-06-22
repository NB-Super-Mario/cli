import { resolve, join, relative } from 'path';

import { Configuration } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { merge } from 'webpack-merge';

// import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
// import HtmlWebpackIncludeSiblingChunksPlugin from 'html-webpack-include-sibling-chunks-plugin';

import tsImportPluginFactory from 'ts-import-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import debug from 'debug';
import { EOL } from 'os';

import getConfig from './base';

import { getBabelOpts, getProdPlugin } from './util';

import conf from './config';

const log = debug('mario-cli:prod');

const getProdConfig = (opts: any = {}): Configuration => {
  log(opts);

  const cwd = conf.cwd || process.cwd();
  const theme = require(resolve(cwd, 'theme'));
  log(`theme:${JSON.stringify(theme)}`);
  const pkg = require(resolve(cwd, 'package.json'));
  const src = conf.src || resolve(cwd, 'src');

  // const theme = require(resolve(cwd, 'theme'));
  const tsConfigFile = join(cwd, 'tsconfig.json');
  log(`locConfig:${JSON.stringify(tsConfigFile)}`);

  const prodConfig: Configuration = getConfig({
    isProd: opts.isProd,
    cwd,
    src,
    entry: 'src/scripts/entry',
    dllOutput: resolve(src, 'dll'),
  });
  // const entris = Object.keys(prodConfig.entry ?? {});

  return merge(prodConfig, {
    mode: 'production',
    output: {
      path: resolve(cwd, 'target', `${pkg.name}`),
      filename: `${conf.prefixTarget}scripts/[name]${
        conf.build.chunkhash ? '.[chunkhash]' : ''
      }.js`,
      chunkFilename: `${conf.prefixTarget}scripts/[name]${
        conf.build.chunkhash ? '.[chunkhash]' : ''
      }.js`,
      publicPath: conf.domain,
      // chunkLoading: false,
      // wasmLoading: false,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: [join(cwd, 'node_modules'), join(cwd, 'src', 'dll')],
          include: [src],
          use: [
            {
              loader: 'babel-loader',
              options: getBabelOpts(false),
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
              options: getBabelOpts(false),
            },
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
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                esModule: false,
              },
            },

            {
              loader: 'css-loader',
              options: {},
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
              loader: MiniCssExtractPlugin.loader,
              options: {
                esModule: false,
              },
            },
            {
              loader: 'css-loader',
              options: {
                // sourceMap: true
                // singleton: true
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
                // sourceMap: true,
              },
            },
          ],
        },
      ],
    },
    plugins: [...getProdPlugin(conf)],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              // We want terser to parse ecma 8 code. However, we don't want it
              // to apply any minification steps that turns valid ecma 5 code
              // into invalid ecma 5 code. This is why the 'compress' and 'output'
              // sections only apply transformations that are ecma 5 safe
              // https://github.com/facebook/create-react-app/pull/4234
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              // Disabled because of an issue with Uglify breaking seemingly valid code:
              // https://github.com/facebook/create-react-app/issues/2376
              // Pending further investigation:
              // https://github.com/mishoo/UglifyJS2/issues/2011
              comparisons: false,
              // Disabled because of an issue with Terser breaking valid code:
              // https://github.com/facebook/create-react-app/issues/5250
              // Pending further investigation:
              // https://github.com/terser-js/terser/issues/120
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            // Added for profiling in devtools
            keep_classnames: conf.build.bundleAnalyzerReport,
            keep_fnames: conf.build.bundleAnalyzerReport,
            output: {
              ecma: 5,
              comments: false,
              // Turned on because emoji and regex is not minified properly using default
              // https://github.com/facebook/create-react-app/issues/2488
              ascii_only: true,
            },
          },
        }),
      ],
      runtimeChunk: {
        name: entrypoint => `runtime~${entrypoint.name}`,
      },
      splitChunks: {
        chunks: 'async',
        minSize: 20000,
        minRemainingSize: 0,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
      emitOnErrors: true,
      concatenateModules: true,
    },
  });
};
export default getProdConfig;
