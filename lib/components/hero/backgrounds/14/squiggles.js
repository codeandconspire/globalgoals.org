/**
 * Generate a squiggly line path following given path
 * @see https://stackoverflow.com/questions/42441472/draw-a-squiggly-line-in-svg
 * @param {Element} follow
 * @param {number} step
 * @param {number} amplitude
 * @param {number} side
 * @returns {string} SVG path
 */

module.exports = function createPath (follow, step = 15, amplitude = 4, side = -1) {
  const pathLen = follow.getTotalLength()

  // Adjust step so that there are a whole number of steps along the path
  const numSteps = Math.round(pathLen / step)

  let pos = follow.getPointAtLength(0)
  let newPath = 'M' + [pos.x, pos.y].join(',')

  for (let i = 1; i <= numSteps; i += 1) {
    let last = pos
    pos = follow.getPointAtLength(i * pathLen / numSteps)

    // Find a point halfway between last and pos. Then find the point that is
    // perpendicular to that line segment, and is amplitude away from
    // it on the side of the line designated by 'side' (-1 or +1).
    // This point will be the control point of the quadratic curve forming the
    // squiggle step.

    // The vector from the last point to this one
    let vector = {
      x: (pos.x - last.x),
      y: (pos.y - last.y)
    }
    // The length of this vector
    let vectorLen = Math.sqrt(vector.x * vector.x + vector.y * vector.y)
    // The point halfwasy between last point and tis one
    let half = {
      x: (last.x + vector.x / 2),
      y: (last.y + vector.y / 2)
    }
    // The vector that is perpendicular to 'vector'
    let perpVector = {
      x: -(amplitude * vector.y / vectorLen),
      y: (amplitude * vector.x / vectorLen)
    }
    // No calculate the control point position
    let controlPoint = {
      x: (half.x + perpVector.x * side),
      y: (half.y + perpVector.y * side)
    }

    newPath += ('Q' + [controlPoint.x, controlPoint.y, pos.x, pos.y].join(','))
    // Switch the side (for next step)
    side = -side
  }

  return newPath
}
