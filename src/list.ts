/**
 * Copyright (c) 2020-present liying Holding Limited
 * @author liying <ly.boy2012@gmail.com>
 * @Description: 模版查看
 * @Date: 2020-04-14 12:21:40
 */

import chalk from 'chalk';

import _ from 'lodash';
import debug from 'debug';

import tpl from './utils/template';

const log = debug('mario-cli:list');

const templateList = (): void => {
  const list = tpl.getTplList();
  const listArr = _.toArray(list);
  let style = 'yellow';

  log(`templateList`);

  console.log(
    chalk.yellow(`
     _   _  ____    _    ____  
    | | | |/ ___|  / \\  |  _ \\ 
    | | | | |     / _ \\ | |_) |
    | |_| | |___ / ___ \\|  _ < 
     \\___/ \\____/_/   \\_\\_| \\_\\
     
     
已有模版列表：\n`)
  );
  listArr.forEach(item => {
    style = item.disabledInfo ? 'gray' : 'yellow';
    console.log(chalk`   {cyanBright ${item.name}} - {${style} ${item.desc}}`);
    console.log(chalk`     gitlab：{green.underline ${item.readme}}\n`);
  });
  console.log();
};
templateList();
