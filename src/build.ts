import webpack from 'webpack';
import chalk from 'chalk';
import debug from 'debug';
// import conf from './webpack/config';
import getProdConfig from './webpack/prod';
import getProdDllConfig from './webpack/prod.dll';

const log = debug('i-cli:build');

/* if (conf.isDll) {

} else {
}
 */
webpack(getProdDllConfig().toConfig(), (err, stats) => {
  if (err || stats.hasErrors()) {
    // 在这里处理错误

    console.log(chalk.red(err.message));
    process.exit(1);
  }

  log(`${JSON.stringify(getProdConfig().toConfig())}`);

  webpack(getProdConfig().toConfig(), (error, status) => {
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
        chunkModules: false
      })}\n\n`
    );

    console.log(chalk.green(' 编译完成。\n'));
  });
});
