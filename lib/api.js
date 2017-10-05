const Prismic = require('prismic-javascript');

const DEFAULT_KEYS = [ 'title', 'image', 'introduction' ];

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

      const { types } = api.data;
      const defaultLinks = Object.keys(types).reduce((list, type) => {
        return list.concat(DEFAULT_KEYS.map(key => type + '.' + key));
      }, []);

      if (options.fetchLinks) {
        options.fetchLinks = defaultLinks.concat(options.fetchLinks);
      } else {
        options.fetchLinks = defaultLinks;
      }

      return Prismic.Api.prototype.query.call(this, q, options, callback);
    };

    return api;
  });
};
