/**
 * Copyright (c) 2020-present liying Holding Limited
 * @author liying <ly.boy2012@gmail.com>
 * @Description: 开发调试
 * @Date: 2020-04-14 12:21:08
 */

import { resolve } from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import merge from 'webpack-merge';
import config from 'config';
import { address } from 'ip';
import chalk from 'chalk';

import getDevConfig from './webpack/dev';

import getDevDllConfig from './webpack/dev.dll';
import conf from './webpack/config';

const port = config.get('port');
const domain = config.get('domain');
const proxy = config.get('proxy');
const ip = address();

webpack(getDevDllConfig().toConfig(), (err, stats) => {
  if (err || stats.hasErrors()) {
    // 在这里处理错误
    if (err) {
      if (!err.message) {
        console.log(err);
      } else {
        console.log(chalk.red(err.message));
      }
    }

    process.exit(1);
  }
  const compiler = webpack(merge(getDevConfig().toConfig(), conf.confWebpack));
  const devServerOptions = {
    // webpack-dev-server options

    contentBase: resolve(process.cwd(), '__build/'),
    index: conf.indexPage || 'index.html',
    open: conf.dev.isOpenBrowser,
    host: ip,
    port,

    // Can also be an array, or: contentBase: "http://localhost/",
    hot: true,
    hotOnly: true,
    // Enable special support for Hot Module Replacement
    // Page is no longer updated, but a "webpackHotUpdate" message is send to the content
    // Use "webpack/hot/dev-server" as additional module in your entry point
    // Note: this does _not_ add the `HotModuleReplacementPlugin` like the CLI option does.

    // Set this as true if you want to access dev server from arbitrary url.
    // This is handy if you are using a html5 router.
    historyApiFallback: false,
    disableHostCheck: true,
    // Set this if you want to enable gzip compression for assets
    compress: true,

    // Set this if you want webpack-dev-server to delegate a single path to an arbitrary server.
    // Use "**" to proxy all paths to the specified server.
    // This is useful if you want to get rid of 'http://localhost:8080/' in script[src],
    // and has many other use cases (see https://github.com/webpack/webpack-dev-server/pull/127 ).
    proxy,

    setup() {
      // Here you can access the Express app object and add your own custom middleware to it.
      // For example, to define custom handlers for some paths:
      // app.get('/some/path', function(req, res) {
      //   res.json({ custom: 'response' });
      // });
    },
    // pass [static options](http://expressjs.com/en/4x/api.html#express.static) to inner express server
    staticOptions: {},
    logLevel: 'debug',
    // webpack-dev-middleware options
    quiet: false,
    noInfo: false,
    lazy: false,
    overlay: true,
    watchOptions: {
      aggregateTimeout: 300,
      ignored: /node_modules/,
      poll: true,
    },
    // It's a required option.
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    },
    stats: {
      color: true,
      all: false,
      modules: true,
      maxModules: 0,
      errors: true,
      warnings: true,
      // our additional options
      moduleTrace: true,
      errorDetails: true,
    },
  };
  WebpackDevServer.addDevServerEntrypoints(
    merge(getDevConfig().toConfig(), conf.confWebpack),
    devServerOptions
  );
  const server = new WebpackDevServer(compiler, devServerOptions);
  server.listen(port, '0.0.0.0', () => {
    console.log(chalk.green(`Starting server on http:${domain}`));
  });
});

/* for (const key in devConf.entry) {
  // devConf.entry[key].unshift('react-hot-loader/patch');
  devConf.entry[key].unshift(`webpack/hot/only-dev-server`);
  devConf.entry[key].unshift(`webpack-dev-server/client?http:${domain}`);
} */
