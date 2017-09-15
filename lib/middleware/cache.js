const zlib = require('zlib');
const util = require('util');
const LRU = require('lru-cache');

const {
  GLOBALGOALS_NUMBER_OF_GRID_LAYOUT: NUMBER_OF_GRID_LAYOUT,
  GLOBALGOALS_GRID_LAYOUT_COOKIE_NAME: LAYOUT_COOKIE_NAME,
  PRISMIC_HOOK,
  PRISMIC_PREVIEW
} = process.env;

const SERVICE_REGEX = new RegExp(`^(?:${ PRISMIC_HOOK }|${ PRISMIC_PREVIEW })`);

const cache = new Cache();
const gzip = util.promisify(zlib.gzip);

module.exports = async (ctx, next) => {
  ctx.cache = cache;

  /**
   * Add Link headers to speed up inital page load
   */

  if (ctx.accepts('html')) {
    ctx.append('Link', [
      `</index-${ process.env.npm_package_version }.js>; rel=preload; as=script`,
      `</index-${ process.env.npm_package_version }.css>; rel=preload; as=style`
    ]);
  }

  /**
   * Prevent caching any content at this point
   */

  ctx.set('Cache-Control', 'no-cache, no-store, must-revalidate');

  /**
   * Determine repsonse type
   */

  if (ctx.accepts('html')) {
    ctx.type = 'text/html';
  } else if (ctx.accepts('json')) {
    ctx.type = 'application/json';
  } else {
    ctx.throw(406);
  }

  if (ctx.acceptsEncodings('gzip')) {
    ctx.set('Content-Encoding', 'gzip');
  }

  /**
   * Determine layout
   */

  let layout = randomizeLayout();
  const prevLayout = parseInt(ctx.cookies.get(LAYOUT_COOKIE_NAME), 10);

  /**
   * Ensure unique layout every page load
   */

  while (layout === prevLayout) {
    layout = randomizeLayout();
  }

  /**
   * Stash layout in state and cookie
   */

  ctx.state.layout = layout;
  ctx.cookies.set(LAYOUT_COOKIE_NAME, layout, { httpOnly: false });

  /**
   * Overwrite layout to not bloat the cache with variants of pages where
   * layout has no effect. The client resolves to cookie layout anyway.
   */

  if (ctx.url !== '/') {
    layout = 'default';
  }


  /**
   * Lookup request in cache
   */

  const accepts = [ ctx.accepts('html', 'json'), ctx.acceptsEncodings('gzip') ];
  const cacheKey = `${ accepts.join(',') },${ layout }:${ ctx.url }`;
  const cached = ctx.cache.get(cacheKey);
  const isDev = process.env.NODE_ENV === 'development';
  const isService = SERVICE_REGEX.test(ctx.path);

  if (!isDev && !isService && cached) {
    ctx.body = cached;
  } else {
    await next();

    /**
     * Zip response
     */

    if (ctx.acceptsEncodings('gzip')) {
      ctx.body = await gzip(Buffer.from(ctx.body, 'utf-8'));
    }

    /**
     * Save in cache if we're error free and not inherently dynamic
     */

    const { status, state: { isStatic, isEditor, routeName }} = ctx;
    if (!routeName !== 'api' && !isStatic && status === 200 && !isEditor) {
      cache.set(cacheKey, ctx.body);
    }
  }
};

/**
 * Randomize grid layout
 */

function randomizeLayout() {
  return Math.floor(Math.random() * NUMBER_OF_GRID_LAYOUT + 1);
}

/**
 * Application wide cache for storing responses in-between requests
 */

function Cache() {
  this.lru = new LRU({
    max: 500,
    maxAge: 1000 * 60 * 60 * 24
  });
}

Cache.prototype.isExpired = function isExpired(key) {
  return !this.lru.has(key);
};

Cache.prototype.get = function get(key, cb) {
  if (cb) {
    cb(null, this.lru.get(key));
  } else {
    return this.lru.get(key);
  }
};

Cache.prototype.set = function set(key, value, ttl, cb = () => {}) {
  this.lru.set(key, value, ttl);
  cb();
};

Cache.prototype.remove = function remove(key, cb = () => {}) {
  this.lru.del(key);
  cb();
};

Cache.prototype.clear = function clear(cb = () => {}) {
  this.lru.reset();
  cb();
};
