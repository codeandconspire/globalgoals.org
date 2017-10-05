const Prismic = require('prismic-javascript');

/**
 * Get Prismic api
 * @returns {Promise<Prismic.Api>}
 */

module.exports = function getApi(url, init) {
  return Prismic.api(url || process.env.PRISMIC_API, init).then(api => {
    api.query = function query(q, options = {}, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }

      options.ref = options.ref || init.ref;

      return Prismic.Api.prototype.query.call(this, q, options, callback);
    };

    return api;
  });
};
