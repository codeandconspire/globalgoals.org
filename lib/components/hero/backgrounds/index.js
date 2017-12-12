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

module.exports = backgrounds

const cache = {}

function backgrounds (num, key = arguments[0], opts = {tight: false}) {
  let instance = cache[key]
  if (!instance) {
    instance = cache[key] = new BACKGROUNDS[num - 1](opts)
  }
  return instance.render()
}
