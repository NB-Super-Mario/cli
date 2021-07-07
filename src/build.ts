/**
 * Copyright (c) 2020-present liying Holding Limited
 * @author liying <ly.boy2012@gmail.com>
 * @Description:编译打包
 * @Date: 2020-04-14 12:20:36
 */

import webpack from 'webpack';
import chalk from 'chalk';
import debug from 'debug';
import merge from 'webpack-merge';
import getProdConfig from './webpack/prod';
import getProdDllConfig from './webpack/prod.dll';
import conf from './webpack/config';

const log = debug('mario-cli:build');

webpack(getProdDllConfig(), (err: any, stats: any) => {
  if (err || stats.hasErrors()) {
    // 在这里处理错误

    console.log(chalk.red(JSON.stringify(stats)));

    console.log(chalk.red(`${err.message}`));

    process.exit(1);
  }
  console.log(chalk.green(' dll 编译完成。\n'));

  log(`prod:${JSON.stringify(merge(getProdConfig(), conf.confWebpack))}`);

  webpack(merge(getProdConfig(), conf.confWebpack), (error, status: any) => {
    if (error) {
      console.log(chalk.red(error.message));
      process.exit(1);
    }

    process.stdout.write(
      `${status.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false,
      })}\n\n`
    );

    console.log(chalk.green(' 编译完成。\n'));
  });
});
