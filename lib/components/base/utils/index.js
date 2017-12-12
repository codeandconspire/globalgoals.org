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

  return Object.entries(classes)
    .filter(([, value]) => !!value)
    .reduce((str, [next]) => str + ' ' + next, root)
    .trim()
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

const CDN_URL = `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/image/fetch`

/**
 * Construct image sizes compatible with application breakpoints
 * @param {object} props Prismic image formatted object
 * @param {array} use List of sizes to use
 * @return {object}
 */

exports.image = function image (props, use = ['small']) {
  const uri = encodeURIComponent(props.url)
  const src = `${CDN_URL}/w_1280,f_auto,q_auto:eco/${uri}`
  const width = props.dimensions.width
  const height = props.dimensions.height

  // Join sizes like: `[(min-width: <breakpoint>) ]<size>w`
  const sizes = SIZES.filter(filter).reduce((sizes, [name, width, [size]]) => {
    return sizes.concat(`${width ? `(min-width: ${width}) ` : ''}${size}w`)
  }, []).join(',')

  // Join sizes like: `<url> <size>w`
  const srcset = SIZES.filter(filter).reduce((set, [name, width, sizes]) => {
    return set.concat(sizes.map((size, index) => {
      return `${CDN_URL}/w_${size},f_auto,q_auto:eco/${uri} ${size}w`
    }))
  }, []).join(',')

  // Filter out sizes to use
  function filter ([name]) {
    return props[name] && use.includes(name)
  }

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
  let offset = opts.offsetTop || 'header'
  if (offset === 'header') offset = require('../../header').height
  const targetRelativePos = element.getBoundingClientRect().top
  const currentPos = window.pageYOffset || window.scollY || 0
  const amount = currentPos + targetRelativePos - offset

  window.scroll({ top: amount, left: 0, behavior: opts.behavior || 'smooth' })
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

/**
 * Check if URL is external or not
 * @param {string} str
 * @return {bool}
 */

exports.externalURL = function externalURL (str) {
  try {
    const url = new window.URL(str)
    return url.hostname !== window.location.hostname
  } catch (err) {
    return false
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
