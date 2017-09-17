const html = require('choo/html');
const component = require('fun-component');

const LEVELS = [
  [ 'c', 'j', 'k', 'n', 't', 'x', 'y', 'd', 's' ],
  [ 'l', 'o' ]
];

const LETTERS = [];
const last = 'z'.charCodeAt(0);
let current = 'a'.charCodeAt(0);

for (; current <= last; current += 1) {
  LETTERS.push(String.fromCharCode(current));
}

module.exports = component({
  name: 'background-4',
  load(element) {
    const height = element.offsetHeight;
    const letters = element.querySelectorAll('.js-letter');

    for (let i = 0; i < letters.length; i += 1) {
      const letter = letters[i];

      let min = 500;
      let max = 1500;
      if (LEVELS[0].indexOf(LETTERS[i]) !== -1) {
        min = 1500;
        max = 2000;
      } else if (LEVELS[1].indexOf(LETTERS[i]) !== -1) {
        min = 2000;
        max = 2500;
      }

      letter.style.transform = `translateY(-${ height }px) rotate(-${ Math.random() * (10 - 5) + 5 }deg)`;
      window.setTimeout(() => {
        letter.addEventListener('transitionend', function ontransitionend() {
          letter.removeEventListener('transitionend', ontransitionend);
          letter.classList.remove('is-falling');
          letter.classList.add('is-bouncing');
        });
        letter.style.transform = null;
        letter.classList.add('in-transition', 'is-falling');
      }, Math.random() * (max - min) + min);
    }

  },
  render() {
    return html `
      <div class="Hero-bg Hero-bg--4" id="hero-bg-4">
        <svg class="Hero-diagram" viewBox="0 0 243 215">
          <g fill="none" fill-rule="evenodd" stroke="#FFF" stroke-width="2" stroke-linecap="square" stroke-dasharray="4 8">
            <path class="Hero-plotLine" d="M1 213h522.4"/>
            <path class="Hero-plotLine" d="M42 204c29.3-69.7 79-104.5 149.2-104.5 70.2 0 120 34.8 149.2 104.5"/>
            <path class="Hero-plotLine" d="M193 213L53 2"/>
          </g>
        </svg>
        <div class="Hero-letters">
          ${ LETTERS.map((letter, index) => html`
            <div class="Hero-letter Hero-letter--${ letter } ${ (index + 1) % 4 ? '' : 'Hero-letter--dark' } js-letter">
              ${ letter }
            </div>
          `) }
        </div>
      </div>
    `;
  }
});
