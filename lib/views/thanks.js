const html = require('choo/html')
const Component = require('nanocomponent')
const intro = require('../components/intro')
const view = require('../components/view')

const WORDS = ['MENTOR', 'HUMAN', 'PHILOSOPHER', 'CROWDSOURCER', 'POET', 'CHANGEMAKER', 'ENVOY', 'DREAMMAKER', 'ACTIVIST', 'VISIONARY', 'INNOVATOR', 'HUMANITARIAN', 'ENTREPRENEUR', 'FEMINIST', 'DISTRUPTOR', 'GIVER', 'ATHLETE', 'FOUNDER', 'JOURNALIST', 'DEFENDER', 'WRITER', 'EDUCATOR', 'ADVOCATE', 'SURGEON', 'INVENTOR', 'TEACHER', 'DREAMER', 'SISTER', 'LAWYER', 'MOTHER', 'LEADER', 'PHILOSOPHER', 'DREAMMAKER', 'DISTRUPTOR', 'STORYTELLER', 'CHAMPION', 'MENTOR', 'INNOVATOR', 'VISIONARY', 'ENTREPRENEUR', 'ADVOCATE', 'SURGEON', 'CHAMPION', 'FOUNDER', 'ATHLETE', 'JOURNALIST']

module.exports = class Home extends Component {
  constructor (id, state, emit) {
    super(id)
    const createElement = view(id, this.view.bind(this))
    this.createElement = function (state, emit, render) {
      this.route = state.route
      return createElement(state, emit, render)
    }
  }

  static identity () {
    return 'home'
  }

  update () {
    return true
  }

  view (state, emit, render) {
    const rows = [[], [], [], [], []]
    for (let i = 0, r = 0, len = WORDS.length, color; i < len; i++, r++) {
      if (r > rows.length - 1) r = 0
      color = Math.floor(Math.random() * 17 + 1)
      while (rows[r].length && color === rows[r][rows[r].length - 1].color) {
        color = Math.floor(Math.random() * 17 + 1)
      }
      rows[r].push({word: WORDS[i], color: color})
    }

    return html`
      <main class="View-main u-transformTarget">
        <div class="Text Text--full" style="padding-top: 1vw; overflow: hidden;">
          <p>
            ${rows.map((row, index) => html`
              <div style="white-space: nowrap;">
                ${row.map(({word, color}, index) => html`
                  <span class="Text-h3 u-inlineBlock u-color${color}" style="margin: 0 0.25ch 0 0; line-height: 0.85; font-size: 5vw;">${word}</span>
                `)}
              </div>
            `)}
          </p>
        </div>
        <section class="View-section">
          ${intro({
            title: 'Thank you for your selections',
            body: html`
              <div>
                <div class="Space Space--endShort">
                  <p>We will let you know the outcome for each award as soon as possible.</p>
                </div>
              </div>
            `,
            pageIntro: true
          })}
        </section>
      </main>
    `
  }
}
