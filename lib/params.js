const REFERRER = '/:referrer(ref-\\w+)?';
const REFERRER_PREFIX = /^ref-/;
const SLUG_PREFIX = /^-/;

/**
 * Add on optional referrer path to given route
 * @param route {string} Route to extend
 * @return {string}
 */

exports.extend = function extend(route) {
  return route.replace(/\/?$/, REFERRER);
};

/**
 * Add on prefixes and whatnot to params
 * @param params {object} Key value pairs of route params
 * @return {object}
 */

exports.encode = function encode(params) {
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
  if (params.referrer) {
    params.referrer = params.referrer.replace(REFERRER_PREFIX, '');
  }

  if (params.slug) {
    params.slug = params.slug.replace(SLUG_PREFIX, '');
  }

  return params;
};
