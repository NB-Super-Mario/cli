import { join } from 'path';

import { Configuration, DefinePlugin, DllPlugin, ProvidePlugin } from 'webpack';

import debug from 'debug';

import conf from './config';

const log = debug('mario-cli:prod-dll');

const getDevDllConfig = (opts: any = {}): Configuration => {
  log(opts);
  const cwd = conf.cwd;

  return {
    mode: 'production',
    entry: conf.dllEntry,

    output: {
      filename: '[name].js',
      path: join(conf.dllOutput),

      // The name of the global variable which the library's
      // require() function will be assigned to
      libraryTarget: 'umd',
      library: '[name]',
    },
    externals: conf.externals,
    plugins: [
      new DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"',
        },
      }),
      new DllPlugin({
        path: join(conf.dllOutput, '[name]-manifest.json'),
        name: '[name]',
        context: cwd,
      }),
      new ProvidePlugin(conf.provideDefs),
    ],
  };
};

export default getDevDllConfig;
