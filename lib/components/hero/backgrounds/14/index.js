const html = require('choo/html')
const Component = require('nanocomponent')
const Nanocache = require('../../../base/utils/cache')
const Fish = require('./fish')
const Bubble = require('./bubble')
const Jellyfish = require('./jellyfish')

module.exports = class Background extends Component {
  constructor (id, state, emit, opts) {
    super(id)
    this.cache = new Nanocache(state, emit)
    Object.assign(this, opts)
  }

  static identity (opts) {
    return `background-14${opts.tight ? '-tight' : ''}`
  }

  update () {
    return false
  }

  load (element) {
    element.querySelector('.js-sea').classList.add('is-visible')
  }

  unload () {
    this.cache.prune()
  }

  createElement () {
    for (var fish = [], f = 0; f < 7; f += 1) { fish.push(f) }
    for (var bubbles = [], b = 0; b < 2; b += 1) { bubbles.push(b) }

    return html`
      <div class="Hero-bg Hero14" id="hero-bg-14">
        <div class="Hero14-sea js-sea">
          ${this.cache.render(Jellyfish)}
          ${bubbles.map(index => this.cache.render(Bubble, index))}
          ${fish.map(index => this.cache.render(Fish, index))}
        </div>
      </div>
    `
  }
}
