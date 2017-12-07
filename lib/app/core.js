const Choo = require('choo')
const nanohref = require('nanohref')
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
