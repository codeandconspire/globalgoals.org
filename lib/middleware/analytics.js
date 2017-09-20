const url = require('url');
const ua = require('universal-analytics');

/**
 * Extend Universal Analytics object
 * @param {any} args
 */

function Tracker(...args) {
  ua.Visitor.call(this, ...args);
}

Tracker.prototype = Object.create(ua.Visitor.prototype);

/**
 * Wrap `send` with a Promise
 * @param {function} fn Optional callback funciton for legacy support
 */

Tracker.prototype.send = function send(fn) {
  return new Promise((resolve, reject) => {
    ua.Visitor.prototype.send.call(this, (err, result) => {
      if (fn) { return fn(err, result); }
      if (err) { return reject(err); }
      resolve(result);
    });
  });
};

module.exports = function (id) {
  const hostname = url.parse(process.env.GLOBALGOALS_URL).hostname;

  /**
   * Capture and track unhandled rejections as fatal exceptions
   */

  process.on('unhandledRejection', err => {
    const track = new Tracker(id, null, { https: true }, {}, { dh: hostname });
    track.exception(err.message || err, true).send();
  });

  return function analytics(ctx, next) {
    if (id) {

      /**
       * Add track object to ctx
       */

      ctx.track = new Tracker(id, null, { https: true }, {}, {
        dh: hostname,
        dp: ctx.path
      });
    } else {

      /**
       * Proxy missing Universal Analytics ID to avoid having to try/catch
       */

      ctx.track = new Proxy({}, {
        get(target, name) {
          if (name in target) {
            return target[name];
          }

          return function noop() { return target; };
        }
      });
    }

    return next();
  };
};
