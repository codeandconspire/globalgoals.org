const pathToRegExp = require('path-to-regexp');
const { __ } = require('./locale');

const REFERRER = '/:referrer(ref-\\w+)?';
const REFERRER_PREFIX = /^ref-/;
const SLUG_PREFIX = /^-/;

/**
 * Produce a URL for given document
 * @param {object} state
 * @param {object} doc
 * @return {string}
 */

exports.href = function href(state, doc) {
  const { routes, params: { referrer }} = state;

  switch (doc.type) {
    case 'goal': return resolve(routes.goal, { goal: doc.data.number, slug: doc.uid, referrer });
    case 'page': return resolve(routes.page, { page: doc.uid, referrer });
    case 'news': return resolve(routes.article, { article: doc.uid, referrer });
    case 'activity': return resolve(routes.activity, { activity: doc.uid, referrer });
    case 'landing_page': {
      switch (doc.uid) {
        case 'home': return resolve(routes.home, { referrer });
        default: return resolve(routes[doc.uid], { referrer });
      }
    }
    default: throw new Error(__('Page type %s not recognized', doc.type));
  }
};

/**
 * Resolve url from route and params
 * @param route {string} Route to resolve
 * @return {string}
 */

const cache = {};
exports.resolve = resolve;
function resolve(route, params = {}) {
  if (cache[route]) {
    // Ensure that all routes are absolute
    const href = cache[route](encode(params)) || '/';

    if (params.query) {
      // Compose key/value query params
      const pairs = Object.entries(params.query).map(pair => pair.join('='));
      const [ path, query ] = href.split('?');

      // Join query with (possible) existing query
      return path + '?' + (query ? query + '&' : '') + pairs.join('&');
    }

    return href;
  }

  cache[route] = pathToRegExp.compile(extend(route));

  return resolve(route, params);
}

/**
 * Add on optional referrer path to given route
 * @param route {string} Route to extend
 * @return {string}
 */

const extend = exports.extend = function extend(route) {
  if (route.indexOf(REFERRER) === -1) {
    return route.replace(/\/?$/, REFERRER);
  }

  return route;
};

/**
 * Add on prefixes and whatnot to params
 * @param params {object} Key value pairs of route params
 * @return {object}
 */

const encode = exports.encode = function encode(params) {
  if (typeof params !== 'object') { return params; }

  if (params.referrer && !REFERRER_PREFIX.test(params.referrer)) {
    // The `referrer` params need the `ref-` prefix
    params.referrer = `ref-${ params.referrer }`;
  }

  if (params.slug && !SLUG_PREFIX.test(params.slug)) {
    // The goal `slug` param need a preceeding dash seperator
    params.slug = `-${ params.slug }`;
  }

  return params;
};

/**
 * Clean up params, removing prefixes and such
 * @see encode
 * @param params {object} Key value pairs of route params
 * @return {object}
 */

exports.parse = function parse(params) {
  if (typeof params.goal === 'string') {
    params.goal = parseInt(params.goal, 10);
  }

  if (params.referrer) {
    params.referrer = params.referrer.replace(REFERRER_PREFIX, '');
  }

  if (params.slug) {
    params.slug = params.slug.replace(SLUG_PREFIX, '');
  }

  return params;
};
