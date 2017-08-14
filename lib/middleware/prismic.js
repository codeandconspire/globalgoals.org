const LRU = require('lru-cache');
const Prismic = require('prismic-javascript/dist/prismic-javascript');

const cache = new Cache();

module.exports = async function prismicApi(ctx, next) {
  ctx.prismic = await Prismic.api(process.env.PRISMIC_API, {
    req: ctx.req,
    apiCache: cache,
    apiDataTTL: 60 * 60 * 24
  });

  if (ctx.url === '/prismic-hook') {
    const { body } = ctx.request;
    ctx.assert(
      body && body.secret === process.env.PRISMIC_SECRET,
      403,
      'Secret mismatch'
    );
    cache.clear();
    ctx.type = 'application/json';
    ctx.status = 200;
    ctx.body = {};
  }

  return next();
};

/**
 * Prismic API cache for storing responses in-between requests
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
  cb(null, this.lru.get(key));
};

Cache.prototype.set = function set(key, value, ttl, cb) {
  this.lru.set(key, value, ttl);
  cb();
};

Cache.prototype.remove = function remove(key, cb) {
  this.lru.del(key);
  cb();
};

Cache.prototype.clear = function clear(cb) {
  this.lru.reset();
  cb();
};
