const { compile } = require('path-to-regexp');

const REFERRER = '/:referrer(ref-\\w+)?';
const REFERRER_PREFIX = /^ref-/;
const SLUG_PREFIX = /^-/;

/**
 * Resolve url from route and params
 * @param route {string} Route to resolve
 * @return {string}
 */

const cache = {};
exports.resolve = function resolve(route, params) {
  if (cache[route]) {
    return cache[route](encode(params));
  }

  cache[route] = compile(extend(route));

  return resolve(route, params);
};

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
