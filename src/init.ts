/**
 * Copyright (c) 2017-present ly.boy2012 Holding Limited
 * @author liying <ly.boy2012@gmail.com>
 * @Description: 脚手架初始化
 * @Date: 2019-09-30 10:56:48
 */
import path from 'path';
import userHome from 'user-home';
import { existsSync } from 'fs';
import inquirer from 'inquirer';
import debug from 'debug';
import { prompt, confirm } from './utils/prompt';

import downLoadTpl from './utils/down-load-tpl';

import tpl from './utils/template';

import { Result } from './utils/result';
import { generate } from './utils/generate-project';

const log = debug('i-cli:init');

/**
 * @description
 * @returns {Promise<void>}
 */
const init = async (): Promise<void> => {
  try {
    // 1、提示选择模版及项目名称
    const choices = tpl.tplChoices();
    const answers: inquirer.Answers = await prompt([
      {
        type: 'list',
        name: 'template',
        message: '请选择工程模版?',
        choices
      },
      {
        type: 'input',
        name: 'projectName',
        message: '请输入项目名称'
      }
    ]);

    if (answers) {
      const repo = tpl.getGitRepo(answers.template);
      const templateName = tpl.getName(answers.template);

      const projectName = answers.projectName;

      // 2、确认选择
      const confirmAnswers: inquirer.Answers = await confirm(
        `当前目录创建 ${projectName} 项目,项目模版（${templateName}）?`
      );
      log(`confirmAnswers:${JSON.stringify(confirmAnswers)}`);
      if (!confirmAnswers.confirm) return;

      // 3、拉去模版
      const templatePath = path.join(
        userHome,
        '.i-cli-templates',
        answers.template
      );
      if (!existsSync(templatePath)) {
        // 如果本地模版不存在服务拉取
        const result: Result = await downLoadTpl(repo, templatePath);
        if (result.state !== 0) return;
      }

      // 4、通过模版生产项目
      const cwd = process.cwd();
      const dest = path.join(cwd, projectName);
      generate(templatePath, dest, projectName);
      // console.log('====generate end =======');
    }
  } catch (error) {
    log(`初始化失败：${error}`);
  }
};

init();
