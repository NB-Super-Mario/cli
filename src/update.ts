/**
 * Copyright (c) 2020-present liying Holding Limited
 * @author liying <ly.boy2012@gmail.com>
 * @Description: 更新代码模版
 * @Date: 2020-04-14 12:22:34
 */

import ora from 'ora';

import path from 'path';
import userHome from 'user-home';
import debug from 'debug';
import { sync as rimraf } from 'rimraf';
import tpl from './utils/template';

const log = debug('mario-cli:update');

const rm = () => {
  return new Promise((resolve, reject) => {
    try {
      const templates = path.join(userHome, '.mario-cli-templates');
      log(`templates:${templates}`);
      rimraf(templates);
      log(`删除模版成功`);
      resolve({ state: 0, msg: 'success' });
    } catch (error) {
      log(`删除模版失败`);
      reject(new Error('删除模版报错'));
    }
  });
};
const run = async () => {
  let spinner = ora('删除模版').start();
  const rmResult: any = await rm();
  spinner.stop();
  if (rmResult.state !== 0) return;
  spinner = ora('更新模版').start();
  try {
    await tpl.update();
  } catch (error) {
    log(`tpl.update 错误：${error}`);
  } finally {
    spinner.stop();
  }
};

run();
