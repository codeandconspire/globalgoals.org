/**
 * Are we in a browser or not
 */

exports.inBrowser = (typeof window !== 'undefined') && (typeof document !== 'undefined')

/**
 * Compose class name based on supplied conditions
 * @param {string} root Base classname
 * @param {object} classes Object with key/valiue pairs of classname/condition
 * @return {string}
 */

exports.className = function className (root, classes) {
  if (typeof root === 'object') {
    classes = root
    root = ''
  }

  return Object.keys(classes).filter(key => classes[key]).reduce((str, key) => {
    return str + ' ' + key
  }, root).trim()
}

/**
 * Modulate function from Framer.js
 * @param {number} value Actual value
 * @param {array} rangeA Actual value range (min, max)
 * @param {array} rangeB Target value range (min, max)
 * @param {boolean} limit Whether to restrain limit within rangeB bounds
 * @return {number}
 */

exports.modulate = (value, rangeA, rangeB, limit = false) => {
  const [fromLow, fromHigh] = rangeA
  const [toLow, toHigh] = rangeB
  const result = toLow + (((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow))

  if (limit === true) {
    if (toLow < toHigh) {
      if (result < toLow) { return toLow }
      if (result > toHigh) { return toHigh }
    } else {
      if (result > toLow) { return toLow }
      if (result < toHigh) { return toHigh }
    }
  }

  return result
}

/**
 * Get viewport height
 * @return {Number}
 */

exports.vh = function vh () {
  return Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
}

/**
 * Get viewport width
 * @return {Number}
 */

exports.vw = function vw () {
  return Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
}

// Sizes specification [<name>, <breakpoint>, [<size>, <size@2x>]]
const SIZES = [
  ['small', 0, [396, 792]],
  ['medium', 768, [617, 1234]],
  ['large', 1024, [1280, 2560]]
]

const CDN_URL = `https://ik.imagekit.io/${process.env.IMAGEKIT_ID}/`
const SOURCE_URL = 'https://globalgoals.cdn.prismic.io/globalgoals/'

/**
 * Construct image sizes compatible with application breakpoints
 * @param {object} props Prismic image formatted object
 * @param {array} use List of sizes to use
 * @return {object}
 */

exports.image = function image (props, use = ['small']) {
  const uri = props.url.split(SOURCE_URL)[1]
  const src = `${CDN_URL}tr:w-1280,q-75,pr-true/${uri}`
  const width = props.dimensions.width
  const height = props.dimensions.height
  const breakpoints = SIZES.filter(([name]) => use.includes(name))

  // Join sizes like: `[(min-width: <breakpoint>) ]<size>px`
  const sizes = breakpoints.reduce((sizes, [name, width, [size]]) => {
    return sizes.concat(`${width ? `(min-width: ${width}px) ` : ''}${size}px`)
  }, []).reverse().join(',')

  // Join sizes like: `<url> <size>w`
  const srcset = breakpoints.reduce((set, [name, width, sizes]) => {
    return set.concat(sizes.map((size, index) => {
      return `${CDN_URL}tr:w-${size},q-75,pr-true/${uri} ${size}w`
    }))
  }, []).join(',')

  return { width, height, src, srcset, sizes, alt: props.alt || '' }
}

/**
 * Detect if user requests routes to happen in a new target/window
 * @param  {object} e
 * @return {boolean}
 */

exports.requestsNewTarget = function requestsNewTarget (e) {
  const notLeftClick = e.button && e.button !== 0
  const keysTriggerNewTab = e.ctrlKey || e.metaKey || e.altKey || e.shiftKey
  return notLeftClick || keysTriggerNewTab || e.defaultPrevented
}

/**
 * Get hex color ligtness
 * @param {string} str Hex color
 * @return {number}
 */

exports.luma = function luma (str) {
  const hex = str.replace(/^#/, '')      // strip #
  const rgb = parseInt(hex, 16)   // convert rrggbb to decimal
  const r = (rgb >> 16) & 0xff  // extract red
  const g = (rgb >> 8) & 0xff  // extract green
  const b = (rgb >> 0) & 0xff  // extract blue

  return 0.2126 * r + 0.7152 * g + 0.0722 * b // per ITU-R BT.709
}

/**
 * Native scrollIntoView lacks an option for top offset, so let's create our own
 * @param  {element} element Element to scroll into view
 * @param  {object} opts
 * @return {undefined}
 */

exports.scrollIntoView = function scrollIntoView (element, opts = {}) {
  let offset = opts.hasOwnProperty('offsetTop') || 'header'
  if (offset === 'header') {
    offset = require('../../header').height
  } else {
    // Fix strange 1px bug
    offset = offset - 1
  }
  const targetRelativePos = element.getBoundingClientRect().top
  const currentPos = window.pageYOffset || window.scollY || 0
  const amount = currentPos + targetRelativePos - offset

  window.scroll({ top: amount, left: 0, behavior: opts.behavior || 'smooth' })
}

/**
 * Create an error with attached status
 * @param {number} status
 * @param {string} msg
 * @return {Error}
 */

exports.statusError = function statusError (status, msg) {
  const err = new Error(msg)
  err.status = status
  return err
}

/**
 * Deconstruct an Error object into a plain object
 * @param {Error} err
 * @return {object}
 */

exports.fromError = function fromError (err) {
  return Object.getOwnPropertyNames(err).reduce((props, key) => {
    props[key] = err[key]
    return props
  }, {})
}

const EXTERNAL_ORIGIN = /^[\w-]+:\/{2,}\[?[\w.:-]+\]?(?::[0-9]*)?/

/**
 * Check if URL is on same domain name
 * @param {string} href
 * @return {bool}
 */

exports.sameDomain = function sameDomain (href) {
  try {
    const url = EXTERNAL_ORIGIN.test(href) && new window.URL(href)
    return !url || (url.hostname === window.location.hostname)
  } catch (err) {
    return true
  }
}

/**
 * Defer callback until browser is idle but at most after timeout
 * @param {function} callback
 * @param {number} timeout
 */

exports.onidle = function onidle (callback, timeout) {
  if (window.requestIdleCallback) {
    const timerId = window.requestIdleCallback(callback, {timeout: timeout})
    return window.cancelIdleCallback.bind(window, timerId)
  } else {
    const timerId = window.setTimeout(callback, timeout)
    return window.clearTimeout.bind(window, timerId)
  }
}
