import path from 'path';

import { sync as rm } from 'rimraf';
import { createWriteStream, createReadStream } from 'fs';
import downloadTpl from '../src/utils/down-load-tpl';

import { existsSync as exists, mkdirSync } from 'fs';

const demoCwd = path.join(__dirname, './demo');
const template = path.join(demoCwd, './template');
// const yml = path.join(demoCwd, 'template.yml');
beforeAll(() => {
  if (!exists(demoCwd)) mkdirSync(demoCwd);

  if (exists(template)) rm(template);
});

afterAll(() => {
  // if (exists(template)) rm(template);
});

test('test download template', async () => {
  jest.setTimeout(30000);
  const result = await downloadTpl(
    'github.com:NB-Super-Mario/template',
    template
  );

  createReadStream(path.join(template, 'template.yml')).pipe(
    createWriteStream(path.join(demoCwd, 'template.yml'))
  );

  expect(result.state).toBe(0);
});
