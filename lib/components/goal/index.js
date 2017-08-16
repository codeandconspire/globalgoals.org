const html = require('choo/html');
const icons = require('./icons');

exports.icon = function icon({goal = 1, className = null, invert = false, label = true} = {}) {
  return icons[goal - 1]({className: className, invert: invert, label: label})
}
