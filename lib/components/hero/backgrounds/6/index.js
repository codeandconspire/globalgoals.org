const html = require('choo/html')
const Component = require('nanocomponent')

const SIZES = [ 'sm', 'md', 'lg' ]

module.exports = class Background extends Component {
  constructor (id, state, emit, opts) {
    super(id)
    Object.assign(this, opts)
  }

  static identity () {
    return 'background-6'
  }

  update () {
    return false
  }

  load (element) {
    const drops = element.querySelectorAll('.js-drop')

    for (let i = 0, len = drops.length; i < len; i += 1) {
      drops[i].addEventListener('animationiteration', onanimationiteration)
    }

    function onanimationiteration (event) {
      this.style.left = `${Math.random() * 100}%`
    }
  }

  createElement () {
    const drops = []
    for (let i = 0; i < (this.tight ? 6 : 8); i += 1) {
      drops.push(html`
        <div class="${randomize()}" style="left: ${Math.random() * 100}%; animation-delay: ${(i * 200) + (i > 3 ? (i * 100) : 0)}ms;">
          <svg class="Hero6-symbol">
            <use xlink:href="#hero-drop-symbol" />
          </svg>
        </div>
      `)
    }

    return html`
      <div class="Hero-bg Hero6 ${this.tight ? 'Hero6--tight' : ''}" id="hero-bg-6">
        <svg class="u-hiddenVisually">
          <symbol viewBox="0 0 24 34" id="hero-drop-symbol">
            <path fill="currentColor" fill-rule="evenodd" d="M12 34c7.77 0 12-5.47 12-12.22C24 17.43 20.26 10.3 12.78.4c-.32-.43-.94-.5-1.37-.2l-.17.2C3.73 10.3 0 17.44 0 21.8 0 28.53 4.23 34 12 34z"/>
          </symbol>
        </svg>
        ${drops}
      </div>
    `
  }
}

function randomize () {
  const classNames = [ 'Hero6-drop', 'js-drop' ]
  const size = SIZES[Math.floor(Math.random() * SIZES.length)]

  classNames.push(`Hero6-drop--${size}`)

  return classNames.join(' ')
}
