const Choo = require('choo');
const nanohref = require('nanohref');
const pathToRegExp = require('path-to-regexp');

/**
 * Custom extensions on choo to support anchor links and other shananigans
 * @param {object} opts
 * @returns Core
 */

function Core(opts) {
  if (!(this instanceof Core)) { return new Core(opts); }

  Choo.call(this, Object.assign({}, opts, { href: false }));

  /**
   * Strip out the hash when determining location
   */

  this._createLocation = function () {
    return location.pathname.replace(/\/$/, '');
  };

  const routes = [];
  const parse = opts.parse || (_ => _);
  this.router = function (href) {
    const [ route, callback ] = routes.find(([ route ]) => route.test(href));
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
  nanohref(anchor => {
    const { pathname, hash } = anchor;

    if (anchor.pathname === location.pathname) {
      if (anchor.hash !== location.hash) {
        // If it's an anchor on the same page scroll into view
        const element = document.querySelector(`#${ hash }`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
      return;
    }

    // Emit navigation event
    this.emitter.emit(this._events.PUSHSTATE, pathname);

    // Add on hash because the: URL is UI
    const href = `${ pathname.replace(/\/$/, '') }${ hash ? `#${ hash }` : '' }`;
    history.replaceState({}, document.title, href);
  });

  return Choo.prototype.start.call(this, ...args);
};

module.exports = Core;
