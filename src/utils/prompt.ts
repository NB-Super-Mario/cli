/**
 * Copyright (c) 2020-present liying Holding Limited
 * @author liying <ly.boy2012@gmail.com>
 * @Description: 命令行交互
 * @Date: 2020-04-23 13:51:01
 */

import inquirer from 'inquirer';

export const prompt = async (
  question: inquirer.QuestionCollection
): Promise<inquirer.Answers> => {
  const result: inquirer.Answers = await inquirer.prompt(question);
  return result;
};

export const confirm = async (message): Promise<inquirer.Answers> => {
  const result: inquirer.Answers = await prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message,
    },
  ]);
  return result;
};
