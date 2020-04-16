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
