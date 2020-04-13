import program from 'commander';
import { resolve } from 'path';

const pkg: any = import(resolve(__dirname, '../', 'package.json'));

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
