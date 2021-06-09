/**
 * Copyright (c) 2020-present liying Holding Limited
 * @author liying <ly.boy2012@gmail.com>
 * @Description: 拉取模版
 * @Date: 2020-04-14 13:37:02
 */
import download from 'download-git-repo';
import debug from 'debug';
import ora from 'ora';

import { Result, State } from './result';

const log = debug('mario-cli:down-load-tpl');

/**
 * @description
 * @param {*} repo 远程git 地址
 * @param {*} dest 下载文件路径
 * @returns {Promise<Result>}
 */
const downLoadTpl = (repo, dest): Promise<Result> => {
  return new Promise((resolve, reject): void => {
    const spinner = ora('模版下载中').start();
    download(repo, dest, { clone: false }, err => {
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
