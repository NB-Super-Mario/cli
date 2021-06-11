import { resolve, join, relative } from 'path';

import { Configuration, DefinePlugin } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { merge } from 'webpack-merge';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import HtmlWebpackIncludeSiblingChunksPlugin from 'html-webpack-include-sibling-chunks-plugin';
import CompressionWebpackPlugin from 'compression-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import ComboPlugin from 'html-webpack-combo-plugin';
import tsImportPluginFactory from 'ts-import-plugin';
import debug from 'debug';
import { EOL } from 'os';

import getConfig from './base';

import { getBabelOpts } from './util';

import conf from './config';

const log = debug('mario-cli:prod');

const getProdConfig = (opts: any = {}): Configuration => {
  log(opts);

  const cwd = conf.cwd || process.cwd();

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
  const entris = Object.keys(prodConfig.entry ?? {});

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
      chunkLoading: false,
      wasmLoading: false,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: [join(cwd, 'node_modules')],
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
                ...(opts.typescript || {}),
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new DefinePlugin(
        conf.definePlugin[0]
        // Object.fromEntries(conf.definePlugin.map(e => [e.key, e.value]))
      ),
      new MiniCssExtractPlugin({
        filename: `${conf.prefixTarget}css/[name].css`,
        allChunks: true,
        ignoreOrder: true,
      }),
      new HtmlWebpackIncludeSiblingChunksPlugin(),
      new OptimizeCssAssetsPlugin(),
      conf.build.productionGzip
        ? new CompressionWebpackPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8,
            deleteOriginalAssets: false,
          })
        : {},
      conf.build.bundleAnalyzerReport ? new BundleAnalyzerPlugin() : {},
      conf.build.combo
        ? ComboPlugin({
            baseUri: `${conf.domain}??`,
            splitter: ',',
            async: false,
            replaceCssDomain: conf.hostname,
            replaceScriptDomain: conf.hostname,
          })
        : {},
    ],
    optimization: {
      runtimeChunk: true,
      splitChunks: {
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
      },
      noEmitOnErrors: true,
      concatenateModules: true,
    },
  });
};
export default getProdConfig;
