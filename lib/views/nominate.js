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
            title: 'Thank you for nominating',
            body: html`
              <div>
                <div class="Space Space--endShort">
                  <p>We appreciate your participation in the Goalkeepers Global Goals Awards 2021. Any questions? Please email Emmyline at <a href="mailto:emmyline@project-everyone.org">emmyline@project-everyone.org</a>.</p>
                </div>
              </div>
            `,
            pageIntro: true
          })}
          <p><a class="Button" style="display: inline-block; margin-top: -2rem;" href="/">Submit another nomination</a></p>
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
      <section class="View-section">
        <style>
          .Goalkeepers-logo {
            max-width: 13rem;
            margin: 6rem 0 2rem;
            display: block;
            width: 50%;
            height: auto;
            position: relative;
            z-index: 1;
          }
          .Goalkeepers-intro {
            margin: 0 0 3.5rem;
            position: relative;
            z-index: 1;
          }
          .Goalkeepers-title.Goalkeepers-title.Goalkeepers-title {
            font-size: 15.8vw;
            margin-bottom: 5rem;
            position: relative;
            z-index: 1;
          }
          .View-main::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: 68vh;
            z-index: 0;
            background: #57deff;
            transform: skewY(-16deg);
            transform-origin: top left;
            animation: Goalkeepers-in 600ms ease-out 0.2s;
          }

          @keyframes Goalkeepers-in {
            from {
              transform: translateY(-150%) skewY(-16deg);
            }
            to {
              transform: translateY(0) skewY(-16deg);
            }
          }
          @media (min-width: 700px) {
            .Goalkeepers-logo {
              margin: 9rem 0 2rem;
            }
            .Goalkeepers-intro {
              margin: 0 0 5rem;
            }
            .Goalkeepers-title.Goalkeepers-title.Goalkeepers-title {
              font-size: 6.5rem;
              margin-bottom: 5rem;
              position: relative;
              left: -0.03em;
              line-height: 0.95;
            }
          }
          @media (min-width: 1000px) {
            .Goalkeepers-logo {
              margin: 8rem 0 2rem;
            }
            .Goalkeepers-intro {
              margin: 0 0 6rem;
            }
            .Goalkeepers-title.Goalkeepers-title.Goalkeepers-title {
              font-size: 8rem;
              margin-bottom: 1.5rem;
              position: relative;
              left: -0.05em;
              line-height: 0.95;
              padding-bottom: 3rem;
              margin-bottom: 5vh;
              margin-top: 0 !important;
            }
          }
          @media (min-width: 1200px) {
            .Goalkeepers-title.Goalkeepers-title.Goalkeepers-title {
              font-size: 9rem;
              max-width: 65rem;
            }
          }
        </style>
        <img class="Goalkeepers-logo" width="1800" height="506" src="/goalkeepers-min.png">
        <div class="Goalkeepers-intro">
          <div class="Text Text--growing" style="max-width: none;">
            <h1 class="Goalkeepers-title">Nominate an inspiring young leader</h1>
            <div style="max-width: 40em">
              <p><strong>The Goalkeepers Global Goals Awards</strong> will tell the extraordinary stories of young, unique leaders taking action to bring the Goals to life in order to help achieve them by 2030 and who are demonstrating innovation and inclusion in the midst of the pandemic.</p>
              <p>As a Goalkeepers nomination partner, <strong>you will help us to identify these award worthy leaders</strong> and submit, according to the awards criteria, 10 individuals between the ages of 16-30 who you believe are deserving of one of our three awards; the Progress Award, Changemaker Award and Campaign Award. Please see here the detailed criteria for each award.</p>
              <p>We reward award winners for their work, incentivize them to continue and most importantly, inspire more action, innovation and inclusion at a time when it is needed most.</p>
            </div>
          </div>
        </div>
        <div class="Space Space--startShort">
          ${render(Form)}
        </div>
      </section>
    </main>
  `
}
