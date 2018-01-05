const html = require('choo/html')
const Component = require('nanocomponent')

const LEVELS = [
  [ 'c', 'j', 'k', 'n', 't', 'x', 'y', 'd', 's' ],
  [ 'l', 'o' ]
]

const LETTERS = []
const last = 'z'.charCodeAt(0)
let current = 'a'.charCodeAt(0)

for (; current <= last; current += 1) {
  LETTERS.push(String.fromCharCode(current))
}

module.exports = class Background extends Component {
  constructor (id, state, emit, opts) {
    super(id)
    Object.assign(this, opts)
  }

  static identity (opts) {
    return `background-4${opts.tight ? '-tight' : ''}`
  }

  update () {
    return false
  }

  load (element) {
    const height = element.offsetHeight
    const letters = element.querySelectorAll('.js-letter')

    for (let i = 0; i < letters.length; i += 1) {
      const letter = letters[i]

      let min = 200
      let max = 900
      if (LEVELS[0].indexOf(LETTERS[i]) !== -1) {
        min = 900
        max = 1400
      } else if (LEVELS[1].indexOf(LETTERS[i]) !== -1) {
        min = 1400
        max = 1900
      }

      letter.style.transform = `translateY(-${height}px) rotate(-${Math.random() * (10 - 5) + 5}deg)`
      window.setTimeout(() => {
        letter.addEventListener('transitionend', function ontransitionend () {
          letter.removeEventListener('transitionend', ontransitionend)
          letter.classList.remove('is-falling')
          letter.classList.add('is-bouncing')
        })
        letter.style.transform = ''
        letter.classList.add('in-transition', 'is-falling')
      }, Math.random() * (max - min) + min)
    }
  }

  createElement () {
    return html`
      <div class="Hero-bg Hero4" id="hero-bg-4">
        <div class="Hero4-letters">
          ${LETTERS.map((letter, index) => html`
            <div class="Hero4-letter Hero4-letter--${letter} ${(index + 1) % 4 ? '' : 'Hero4-letter--dark'} js-letter">
              ${letter}
            </div>
          `)}
        </div>
      </div>
    `
  }
}
