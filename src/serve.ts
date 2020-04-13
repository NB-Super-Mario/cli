import connect from 'connect';
import http from 'http';
import chalk from 'chalk';
import compression from 'compression';

import serveStatic from 'serve-static';
import cookieSession from 'cookie-session';
import config from 'config';

import conf from './webpack/config';

const app = connect();

// gzip/deflate outgoing responses

const PORT = config.get('port');
const domain = config.get('domain');
app.use(compression());

// store session state in browser cookie

app.use(
  cookieSession({
    keys: ['secret1', 'secret2']
  })
);

app.use(
  serveStatic(`target/${conf.pkg.name}`, {
    index: [conf.indexPage || 'home.html']
  })
);

http.createServer(app).listen(PORT, '0.0.0.0', () => {
  console.log(chalk.green(`Starting server on http:${domain}`));
});
