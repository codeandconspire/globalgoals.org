const html = require('choo/html')
const Nanocomponent = require('nanocomponent')
const createFish = require('./fish')
const createBubble = require('./bubble')
const jellyfish = require('./jellyfish')

const fish = [
  createFish(),
  createFish(),
  createFish(),
  createFish(),
  createFish(),
  createFish(),
  createFish()
]

const bubbles = [
  createBubble(),
  createBubble(),
  createBubble()
]

module.exports = class Background extends Nanocomponent {
  constructor (opts) {
    super('background-14')
    Object.assign(this, opts)
  }

  update () {
    return false
  }

  load (element) {
    element.querySelector('.js-sea').classList.add('is-visible')
  }

  createElement () {
    return html`
      <div class="Hero-bg Hero14" id="hero-bg-14">
        <div class="Hero14-sea js-sea">
          ${jellyfish()}
          ${bubbles.map((render, index) => render(index))}
          ${fish.map((render, index) => render(index))}
        </div>
      </div>
    `
  }
}
