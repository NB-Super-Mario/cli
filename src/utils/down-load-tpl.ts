import download from 'download-git-repo';
import debug from 'debug';
import ora from 'ora';

import { Result, State } from './result';

const log = debug('i-cli:down-load-tpl');

const downLoadTpl = (repo, dest): Promise<Result> => {
  return new Promise((resolve, reject): void => {
    const spinner = ora('模版下载中').start();
    download(repo, dest, { clone: true }, err => {
      spinner.stop();
      if (!err) {
        resolve({ state: State.Succss, msg: 'success' });
      } else {
        log(`下载模版异常：${err}`);
        reject(new Error('下载模版异常'));
      }
    });
  });
};
export default downLoadTpl;
