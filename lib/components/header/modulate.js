/**
 * Modulate function from Framer.js
 */

module.exports = (value, rangeA, rangeB, limit = false) => {
  const [fromLow, fromHigh] = Array.from(rangeA);
  const [toLow, toHigh] = Array.from(rangeB);
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
