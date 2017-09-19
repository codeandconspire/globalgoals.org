const html = require('choo/html');
const component = require('fun-component');
const createFish = require('./fish');
const createBubble = require('./bubble');
const jellyfish = require('./jellyfish');

const fish = [
  createFish(),
  createFish(),
  createFish(),
  createFish(),
  createFish(),
  createFish(),
  createFish()
];

const bubbles = [
  createBubble(),
  createBubble(),
  createBubble()
];

module.exports = component({
  name: 'background-14',
  load(element) {
    element.querySelector('.js-sea').classList.add('is-visible');
  },
  render() {
    return html`
      <div class="Hero-bg Hero14" id="hero-bg-14">
        <div class="Hero14-sea js-sea">
          ${ jellyfish() }
          ${ bubbles.map((render, index) => render(index)) }
          ${ fish.map((render, index) => render(index)) }
        </div>
      </div>
    `;
  }
});
