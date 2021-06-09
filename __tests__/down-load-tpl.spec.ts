import path from 'path';
import downloadTpl from '../src/utils/down-load-tpl';
import { sync as rm } from 'rimraf';

import { existsSync as exists, mkdirSync } from 'fs';

const demoCwd = path.join(__dirname, './demo');
const template = path.join(demoCwd, './.mario-templates');

beforeAll(() => {
  if (!exists(demoCwd)) mkdirSync(demoCwd);

  if (exists(template)) rm(template);
});

afterAll(() => {
  if (exists(template)) rm(template);
});

test('test downloadTpl', async () => {
  jest.setTimeout(30000);
  const templatePath = path.join(template, 'template_4_h5');
  const result = await downloadTpl(
    'github.com:NB-Super-Mario/template_4_h5#TEMPLATE_4_H5_tag_V1.0.0',
    templatePath
  );
  expect(result.state).toBe(0);
});
