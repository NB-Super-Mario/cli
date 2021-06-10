import { join } from 'path';
import webpack, { Configuration } from 'webpack';
import debug from 'debug';
import conf from './config';

const log = debug('mario-cli:dev-dll');

const getDevDllConfig = (opts: any = {}): Configuration => {
  log(`opts ${opts}`);

  const cwd = conf.cwd;
  return {
    mode: 'development',
    entry: conf.dllEntry,
    output: {
      filename: '[name].js',
      path: conf.dllOutput,
      // The name of the global variable which the library's
      // require() function will be assigned to
      libraryTarget: 'umd',
      library: '[name]',
    },
    externals: conf.externals,
    plugins: [
      new webpack.DllPlugin({
        path: join(conf.dllOutput, '[name]-manifest.json'),
        name: '[name]',
        context: cwd,
      }),
    ],
  };
};

export default getDevDllConfig;
