const html = require('choo/html')
const Component = require('nanocomponent')
const Form = require('../components/form')
const intro = require('../components/intro')
const view = require('../components/view')

const WORDS = ['MENTOR', 'HUMAN', 'PHILOSOPHER', 'CROWDSOURCER', 'POET', 'CHANGEMAKER', 'ENVOY', 'DREAMMAKER', 'ACTIVIST', 'VISIONARY', 'INNOVATOR', 'HUMANITARIAN', 'ENTREPRENEUR', 'FEMINIST', 'DISTRUPTOR', 'GIVER', 'ATHLETE', 'FOUNDER', 'JOURNALIST', 'DEFENDER', 'WRITER', 'EDUCATOR', 'ADVOCATE', 'SURGEON', 'INVENTOR', 'TEACHER', 'DREAMER', 'SISTER', 'LAWYER', 'MOTHER', 'LEADER', 'PHILOSOPHER', 'DREAMMAKER', 'DISTRUPTOR', 'STORYTELLER', 'CHAMPION', 'MENTOR', 'INNOVATOR', 'VISIONARY', 'ENTREPRENEUR', 'ADVOCATE', 'SURGEON', 'CHAMPION', 'FOUNDER', 'ATHLETE', 'JOURNALIST']

module.exports = class Home extends Component {
  constructor (id, state, emit) {
    super(id)
    const createElement = view(id, home)
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
}

function home (state, emit, render) {
  if (state.route === 'thanks') {
    return html`
      <main class="View-main u-transformTarget">
        <section class="View-section">
          ${intro({
            title: 'Thank you for your submission',
            body: html`
              <div>
                <div class="Space Space--endShort">
                  <p>It will now be reviewed by our shortlisting panel and we’ll be in touch in June if your submission is taken to the next stage. Any questions? Please email Deena on <a href="mailto:deena@project-everyone.org">deena@project-everyone.org</a>.</p>
                  <p>Remember, you can make up to 10 nominations.</p>
                </div>
                <a href="/" class="Button u-inlineBlock">Make another nomination</a>
              </div>
            `,
            pageIntro: true
          })}
        </section>
      </main>
    `
  }

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
        <div class="Space Space--textBlock Space--textBlockFirst">
          <div class="Grid Grid--md-filled">
            <div class="Grid-cell Grid-cell--md1of2">
              <div class="Text Text--growing">
                <h1 class="Text-h1" style="margin-top: 0">Nominations</h1>
                <p>The Goalkeepers, Global Goals Awards 2018 will tell the stories of remarkable individuals taking action to bring the Goals to life and to help achieve them by 2030. This year the focus is on finding emerging young influencers focused on youth initiatives, who are creating demonstrable change in a specific Goals related area.</p>
              </div>
            </div>
            <div class="Grid-cell Grid-cell--fill">
              <div class="Text Text--full">
                <img src="/goalkeepers-logo.png" style="background: none;">
              </div>
            </div>
          </div>
        </div>
        <div class="Space Space--start">
          ${render(Form)}
        </div>
      </section>
    </main>
  `
}
