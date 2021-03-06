import { join } from 'path';
import Config from 'webpack-chain';
import webpack from 'webpack';

import debug from 'debug';

import conf from './config';

const log = debug('mario-cli:prod-dll');

const getDevDllConfig = (opts: any = {}): Config => {
  log(opts);
  const devDllConfig = new Config();
  const cwd = conf.cwd;

  devDllConfig.mode('production');

  Object.keys(conf.dllEntry).forEach(name => {
    log(`dllEntry:name ${name}`);
    devDllConfig.entry(`${name}`);

    conf.dllEntry[`${name}`].forEach(item => {
      log(
        `devDllConfig:${name}:
          ${devDllConfig.entryPoints.get(name)}`
      );
      log(`devDllConfig:item:${item}`);
      devDllConfig.entryPoints.get(`${name}`).add(item);
    });
    devDllConfig.end();
  });

  devDllConfig.output
    .filename(`[name].js`)
    .path(conf.dllOutput)
    .libraryTarget('umd')
    .library('[name]');
  devDllConfig.externals(conf.externals);
  devDllConfig.plugin('dll').use(webpack.DllPlugin, [
    {
      path: join(conf.dllOutput, '[name]-manifest.json'),
      name: '[name]',
      context: cwd,
    },
  ]);
  devDllConfig
    .plugin('.providePlugin')
    .use(webpack.ProvidePlugin, [conf.provideDefs]);

  return devDllConfig;
};

export default getDevDllConfig;
