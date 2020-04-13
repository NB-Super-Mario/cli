import { resolve } from 'path';
import { existsSync } from 'fs';
import config from 'config';

const domain = config.get('domain');
const hostname = config.get('hostname');
const isOpenBrowser = config.get('isOpenBrowser');
const cwd = process.cwd();
const pkg = require(resolve(cwd, 'package.json'));

const src = resolve(cwd, 'src');
const PREFIX_TARGET = '';
const defaultAppConfig = {
  definePlugin: [
    {
      DOMAIN: JSON.stringify(domain)
    }
  ],
  alias: {
    '@components': resolve(cwd, 'src/scripts/components'),
    '@actions': resolve(cwd, 'src/scripts/actions'),
    '@api': resolve(cwd, 'src/scripts/api'),
    '@routes': resolve(cwd, 'src/scripts/routes'),
    '@util': resolve(cwd, 'src/scripts/util')
  },
  domain,
  hostname,
  pkg,
  cwd,
  src,
  prefixTarget: '', // 静态
  isDll: true,
  dllEntry: {
    react: [
      'react',
      'react-dom',
      'react-router-dom',
      'redux',
      'react-redux',
      'connected-react-router'
    ]
  },
  dllOutput: resolve(cwd, 'src', 'dll'),
  provideDefs: {},
  externals: {},
  alwaysWriteToDisk: true,
  minify: {
    removeComments: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true
  },
  copyRes: [
    { from: 'src/static-res/mock', to: `${PREFIX_TARGET}static-mock` },
    { from: 'src/static-res/img', to: `${PREFIX_TARGET}static-img` },
    { from: 'src/static-res/css', to: `${PREFIX_TARGET}static-css` }
    // { from: 'src/static-res/icons', to: `static-icons` }
  ],
  dev: {
    publicPath: domain,
    output: resolve(cwd, '__build'),
    isOpenBrowser
  },
  build: {
    publicPath: domain,
    output: resolve(cwd, 'target', `${pkg.name}`),
    bundleAnalyzerReport: process.env.npm_config_report,
    productionGzip: true,
    combo: false,
    chunkhash: true
  },
  isAntd: false,
  isBootstrap: false,
  indexPage: 'home.html'
};
type BaseConf = {
  definePlugin: {
    [key: string]: any;
  }[];
  alias: {
    [key: string]: string;
  };
  domain: string;
  hostname: string;
  pkg: any;
  cwd: string;
  src: string;
  prefixTarget: string;
  isDll: boolean;
  dllEntry: {
    [key: string]: string[];
  };
  dllOutput: string;
  provideDefs: {
    [key: string]: string[];
  };
  externals: {
    [key: string]: string[];
  };
  alwaysWriteToDisk: boolean;
  minify: {
    [key: string]: any;
  };
  copyRes: {
    from: string;
    to: string;
  }[];
  dev: {
    publicPath: string;
    output: string;
    isOpenBrowser: boolean;
  };
  build: {
    publicPath: string;
    output: string;
    bundleAnalyzerReport: string | undefined;
    productionGzip: boolean;
    combo: boolean;
    chunkhash: boolean;
  };
  isAntd: boolean;
  isBootstrap: boolean;
  indexPage: string;
};
const mergeConfig = (): BaseConf => {
  if (existsSync(resolve(cwd, 'app.config.js'))) {
    return Object.assign(
      defaultAppConfig,
      require(resolve(cwd, 'app.config.js'))
    );
  }
  return defaultAppConfig;
};
export default mergeConfig();
