exports.className = function className(root, classes) {
  if (typeof root === 'object') {
    classes = root;
    root = '';
  }

  return Object.entries(classes)
    .filter(([key, value]) => !!value)
    .reduce((str, [next]) => str + ' ' + next, root)
    .trim();
};

/**
 * Modulate function from Framer.js
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
