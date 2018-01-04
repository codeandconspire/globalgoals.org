const Choo = require('choo')
const onIdle = require('on-idle')
const nanohref = require('nanohref')
const Nanocache = require('../components/base/utils/cache')
const { scrollIntoView, inBrowser } = require('../components/base/utils')

// Only enable timing in development
if (inBrowser) {
  window.localStorage.DISABLE_NANOTIMING = process.env.NODE_ENV !== 'development'
}

/**
 * Custom extensions on choo to support anchor links and other shananigans
 * @param {object} opts
 * @returns Core
 */

function Core (opts) {
  if (!(this instanceof Core)) { return new Core(opts) }

  Choo.call(this, { href: false })

  /**
   * Strip out the hash when determining window.location
   */

  this._createLocation = function () {
    return window.location.pathname.replace(/\/$/, '')
  }

  /**
   * Preemptive implementaion of Choo component
   * @see https://github.com/choojs/choo/pull/606
   */

  const cache = new Nanocache(this.state, this.emitter.emit.bind(this.emitter))

  if (!this._hasWindow) {
    // Proxy the cache state to always get the latest state (as app.toString())
    // overwrites this.state on each render during ssr
    cache.state = new Proxy(this.state, {
      get: (target, key) => this.state[key],
      set: (target, key, value) => (this[key] = value),
      has: (target, prop) => prop in this.state
    })
  }

  const render = cache.render.bind(cache)
  const prune = cache.prune.bind(cache)
  const deferred = () => window.requestAnimationFrame(prune)
  const setRoute = this.route.bind(this)
  this.route = (route, handler) => {
    setRoute(route, (state, emit) => {
      let res
      if (handler.identity) {
        res = cache.render(handler, state, emit, render)
      } else {
        res = handler(state, emit, render)
      }
      // Should prune after morph but waiting one frame on idle should suffice
      if (this._hasWindow) onIdle(deferred)
      return res
    })
  }
}

Core.prototype = Object.create(Choo.prototype)

Core.prototype.start = function (...args) {
  let isActive = true
  this.emitter.on('app:terminate', () => { isActive = false })

  nanohref(anchor => {
    const { pathname, hash } = anchor

    if (!isActive) {
      // Do a hard page load if the application has been terminated
      return window.location.assign(anchor.href)
    }

    if (anchor.pathname === window.location.pathname) {
      const element = document.querySelector(hash)
      if (element) scrollIntoView(element)
      return
    }

    // Emit navigation event
    this.emitter.emit(this._events.PUSHSTATE, pathname)

    // Add on hash (replacing just routed url) – because the URL is UI
    const href = `${pathname.replace(/\/$/, '')}${hash ? `#${hash}` : ''}`
    window.history.replaceState({}, document.title, href)
  })

  return Choo.prototype.start.apply(this, args)
}

module.exports = Core
