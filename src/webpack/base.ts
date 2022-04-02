import { Configuration, ProvidePlugin, IgnorePlugin } from 'webpack';
import { join, resolve } from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';

import debug from 'debug';

import conf from './config';

import { getDllRerencePlugin, getEntries, getHtmlPlugin } from './util';

const log = debug('mario-cli:base');

const getBaseConfig = (opts: any = {}): Configuration => {
  const cwd = opts.cwd || process.cwd();
  const entry = getEntries(cwd, opts.entry);
  log(opts);

  // Instantiate the configuration with a new API
  const config: Configuration = {
    cache: true,
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
      // enforceExtension: true,
      // preferRelative: true,
      extensions: [
        '.tsx',
        '.ts',
        '.js',
        '.web.js',
        '.json',
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
      new CopyWebpackPlugin({
        patterns: [
          {
            from: opts.dllOutput,
            to: `${conf.prefixTarget}lib`,
            globOptions: {
              ignore: ['*.json'],
            },

            context: cwd,
          },
          {
            from: join(opts.src, 'scripts', 'lib', 'min'),
            to: `${conf.prefixTarget}lib/[name][ext]`,
            globOptions: {
              ignore: ['*.json'],
            },
            context: cwd,
          },
          { from: 'src/static-res/favicon.ico', to: 'favicon.ico' },
          { from: 'src/static-res/healthCheck.html', to: 'healthCheck.html' },
          ...conf.copyRes,
        ],
      }),
      new IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),

      new ProvidePlugin(conf.provideDefs),
    ],
  };

  return config;
};

export default getBaseConfig;
