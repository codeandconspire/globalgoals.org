const Choo = require('choo');
const nanohref = require('nanohref');
const pathToRegExp = require('path-to-regexp');
const { scrollIntoView } = require('../components/base/utils');

/**
 * Custom extensions on choo to support anchor links and other shananigans
 * @param {object} opts
 * @returns Core
 */

function Core(opts) {
  if (!(this instanceof Core)) { return new Core(opts); }

  Choo.call(this, { href: false });

  /**
   * Strip out the hash when determining location
   */

  this._createLocation = function () {
    return location.pathname.replace(/\/$/, '');
  };

  const routes = [];
  const parse = opts.parse || (_ => _);
  this.router = function (href) {
    let route, callback;

    for (let i = 0; i < routes.length; i += 1) {
      if (routes[i][0].test(href)) {
        route = routes[i][0];
        callback = routes[i][1];
        break;
      }
    }

    const match = href.match(route);

    if (match) {
      const params = {};

      route.keys.forEach((key, index) => {
        const value = match[index + 1];
        if (value) {
          params[key.name] = value;
        }
      });

      return callback(parse(params)).call();
    }
  };
  this.router.on = function (route, callback) {
    routes.push([ pathToRegExp(route), callback ]);
  };
}

Core.prototype = Object.create(Choo.prototype);

Core.prototype.start = function (...args) {
  let isActive = true;
  this.emitter.on('app:terminate', () => { isActive = false; });

  nanohref(anchor => {
    const { pathname, hash } = anchor;

    if (!isActive) {
      // Do a hard page load if the application has been terminated
      return location.assign(anchor.href);
    }

    if (anchor.pathname === location.pathname) {
      if (anchor.hash !== location.hash) {
        const element = document.querySelector(hash);
        if (element) {
          scrollIntoView(element);
        }
      }
      return;
    }

    // Emit navigation event
    this.emitter.emit(this._events.PUSHSTATE, pathname);

    // Add on hash (replacing just routed url) – because the URL is UI
    const href = `${ pathname.replace(/\/$/, '') }${ hash ? `#${ hash }` : '' }`;
    history.replaceState({}, document.title, href);
  });

  return Choo.prototype.start.call(this, ...args);
};

module.exports = Core;
