import yaml from 'js-yaml';
import fs, { createReadStream, createWriteStream } from 'fs';
import path from 'path';
import debug from 'debug';

import downloadTpl from './down-load-tpl';

const log = debug('mario-cli:template');

const yml = path.join(__dirname, '../../template.yml');

const getTpl = (): any => {
  let tpl;
  try {
    tpl = yaml.safeLoad(fs.readFileSync(yml, 'utf8'));
  } catch (error) {
    log(`读取yml 文件错误：${error}`);
  }
  return tpl;
};

const tpl = getTpl();
const list = tpl && tpl.list ? tpl.list : null;
const remotePath = tpl && tpl.remotePath ? tpl.remotePath : null;

const getTplList = () => {
  return list;
};

const getGitRepo = key => {
  return list[key] ? list[key].git : null;
};
const getName = key => {
  return list[key] ? list[key].name : null;
};

const tplChoices = () => {
  const keys = Object.keys(list);
  const result: any[] = [];
  keys.forEach(key => {
    const item: any = {
      name: list[key].name,
      value: key,
    };
    if (list[key].disabledInfo) item.disabled = list[key].disabledInfo;
    result.push(item);
  });
  return result;
};

const update = async (template: string): Promise<void> => {
  log(`remotePath:${remotePath}`);
  log(`template:${template}`);
  const result = await downloadTpl(remotePath, template);

  if (result.state !== 0) return;
  createReadStream(path.join(template, 'template.yml')).pipe(
    createWriteStream(yml)
  );
};

export default {
  getGitRepo,
  getName,
  getTplList,
  remotePath,
  update,
  tplChoices,
};
