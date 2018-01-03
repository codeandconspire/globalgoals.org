const Nanocache = require('../../base/utils/cache')

const BACKGROUNDS = [
  require('./1'),
  require('./2'),
  require('./3'),
  require('./4'),
  require('./5'),
  require('./6'),
  require('./7'),
  require('./8'),
  require('./9'),
  require('./10'),
  require('./11'),
  require('./12'),
  require('./13'),
  require('./14'),
  require('./15'),
  require('./16'),
  require('./17')
]

const cache = new Nanocache({}, function noop () {})

module.exports = backgrounds

function backgrounds (goal, opts = {tight: false}) {
  return cache.render(BACKGROUNDS[goal - 1], opts)
}
