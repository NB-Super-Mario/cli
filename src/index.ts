/**
 * Copyright (c) 2020-present liying Holding Limited
 * @author liying <ly.boy2012@gmail.com>
 * @Description: 初始化
 * @Date: 2020-04-14 12:20:18
 */
import program from 'commander';
import { resolve } from 'path';
import { dynamicImport } from './utils/dynamic-import';

(async (): Promise<void> => {
  const pkg = await dynamicImport(resolve(__dirname, '../', 'package.json'));

  program
    .version(pkg.version)
    .usage('<command> [options]')
    .command('init', '通过模版创建项目')
    .command('list', '查看模版列表')
    .command('dev', '开发调试')
    .command('update', '更新模版')
    .command('build version', 'run build command')
    .command('serve', 'run serve')
    .parse(process.argv);
})();
