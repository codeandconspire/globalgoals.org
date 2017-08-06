const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const send = require('koa-send');
const postcss = require('postcss');
const browserify = require('browserify');
const watchify = require('watchify-middleware');
const chokidar = require('chokidar');

const ROOT = __dirname;

const readFile = promisify(fs.readFile);

const bundler = browserify('app/index.js', {
  basedir: ROOT,
  debug: true,
  transform: [
    require('localenvify')
  ]
});
const middleware = watchify(bundler);

const cssBundler = postcss([
  require('postcss-import')(),
  require('postcss-custom-media')(),
  require('postcss-url')()
]);

let deferred = processCSS();
const watcher = chokidar.watch('**/*.css', { cwd: ROOT, ignoreInitial: true });
watcher.on('all', () => { deferred = processCSS(); });

function processCSS() {
  const file = path.resolve(ROOT, 'app/index.css');
  return readFile(file, 'utf8').then(css => {
    return cssBundler.process(css, { from: file, to: file });
  });
}

module.exports = async function (ctx, next) {
  if (ctx.url === '/index.js') {
    middleware(ctx.req, ctx.res);
  } else if (ctx.url === '/index.css') {
    try {
      const result = await deferred;
      ctx.set('Content-Type', 'text/css');
      ctx.body = result.css;
    } catch (err) {
      ctx.status = 500;
      ctx.body = err;
    }
  } else if (/^\/components/.test(ctx.url)) {
    return send(ctx, ctx.path, { root: ROOT });
  } else {
    return next();
  }
};
