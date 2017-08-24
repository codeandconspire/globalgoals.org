const zlib = require('zlib');
const util = require('util');
const LRU = require('lru-cache');

const cache = new Cache();
const gzip = util.promisify(zlib.gzip);

module.exports = async (ctx, next) => {
  ctx.cache = cache;

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
   * Lookup request in cache
   */

  const accepts = [ ctx.accepts('html', 'json'), ctx.acceptsEncodings('gzip') ];
  const cacheKey = `${ accepts.join(',') }:${ ctx.url }`;
  const cached = cache.get(cacheKey);

  if (cached) {
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
     * Save in cache
     */

    cache.set(cacheKey, ctx.body);
  }
};

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
