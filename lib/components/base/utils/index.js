/**
 * Compose class name based on supplied conditions
 * @param {string} root Base classname
 * @param {object} classes Object with key/valiue pairs of classname/condition
 * @return {string}
 */

exports.className = function className(root, classes) {
  if (typeof root === 'object') {
    classes = root;
    root = '';
  }

  return Object.entries(classes)
    .filter(([, value]) => !!value)
    .reduce((str, [next]) => str + ' ' + next, root)
    .trim();
};

/**
 * Modulate function from Framer.js
 * @param {number} value Actual value
 * @param {array} rangeA Actual value range (min, max)
 * @param {array} rangeB Target value range (min, max)
 * @param {boolean} limit Whether to restrain limit within rangeB bounds
 * @return {number}
 */

exports.modulate = (value, rangeA, rangeB, limit = false) => {
  const [fromLow, fromHigh] = rangeA;
  const [toLow, toHigh] = rangeB;
  const result = toLow + (((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow));

  if (limit === true) {
    if (toLow < toHigh) {
      if (result < toLow) { return toLow; }
      if (result > toHigh) { return toHigh; }
    } else {
      if (result > toLow) { return toLow; }
      if (result < toHigh) { return toHigh; }
    }
  }

  return result;
};

/**
 * Get viewport height
 * @return {Number}
 */

exports.vh = function vh() {
  return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
};

/**
 * Get viewport width
 * @return {Number}
 */

exports.vw = function vw() {
  return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
};

// Sizes specification [ <name>, <breakpoint>, <size>, <size@2x> ]
const SIZES = [
  [ 'small', 0, 396, 792 ],
  [ 'medium', 768, 617, 1234 ],
  [ 'large', 1024, 1280, 2560 ]
];

/**
 * Construct image sizes compatible with application breakpoints
 * @param {object} props Prismic image formatted object
 * @param {array} use List of sizes to use
 * @return {object}
 */

exports.image = function image(props, use = ['small']) {
  const biggest = props[SIZES.slice().reverse().find(filter)[0]];

  // Use biggest requested image (1x) for default props
  const src = biggest.url;
  const width = biggest.dimensions.width;
  const height = biggest.dimensions.height;

  // Join sizes like: `[(min-width: <breakpoint>) ]<size>w`
  const sizes = SIZES.filter(filter).reduce((sizes, [, width, size ]) => {
    return sizes.concat(`${ width ? `(min-width: ${ width }) ` : '' }${ size }w`);
  }, []).join(',');

  // Join sizes like: `<url> <size>w, <url@2x> <size@2x>w`
  const srcset = SIZES.filter(filter).reduce((set, [ name,, ...sizes ]) => {
    return set.concat(sizes.map((size, index) => {
      const key = name + (index ? `${ index + 1 }x` : '');
      return `${ props[key].url } ${ size }w`;
    }));
  }, []).join(',');

  // Filter out sizes to use
  function filter([ name ]) {
    return use.includes(name);
  }

  return { width, height, src, srcset, sizes, alt: props.alt || '' };
};

/**
 * Detect if user requests routes to happen in a new target/window
 * @param  {object} e
 * @return {boolean}
 */

exports.requestsNewTarget = (e) => {
  const notLeftClick = e.button && e.button !== 0;
  const keysTriggerNewTab = e.ctrlKey || e.metaKey || e.altKey || e.shiftKey;
  return notLeftClick || keysTriggerNewTab || e.defaultPrevented;
};
