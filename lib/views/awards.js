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
          <div class="Grid">
            <div class="Grid-cell Grid-cell--md1of2">
              <div class="Text Text--full">
                <img src="/goalkeepers-logo.png" style="background: none; max-width: 460px; position: relative; top: -40px;">
                <br>
                <svg width="401" height="215" viewBox="0 0 401 215" style="width: 180px; height: auto; transform: translate(63%, -37%);">
                  <g fill="#00A3DA" fill-rule="evenodd">
                    <path d="M367.8 66.4c-5-2.7-5.1-6.5-4.8-8 .2-1.3 1.2-.7 1.8-.7 3.3 0 6.7-1 11-5.3a16.6 16.6 0 0 0-1.1-22.7c-8-7.6-16.3-6.3-21.7.5a8.5 8.5 0 0 1-6.2 2.4c-3.5-.1-1.3 2.6-1.3 3.2 0 .5-.5 1-.8.8-1.2-.3-.7 1.4-.7 2 0 .5-.5.8-.8.8-1.4 0-1 1.3-1 1.6 0 .4 0 1-.6 1.3-.4.2-1 1.4-1 2.3 0 1.6 1.5 2.7 3.9 4.5 2.4 1.8 2.7 3.5 2.8 4.7 0 1.3.1 3.2.7 4.6.6 1.5.6 4.5-2.8 4.6-4 .2-11.4 3.4-12 3.6-2.3.9-5.3 1.2-7.7.6l-3.7-3c-.5-1.7.4-3.4 1.2-4.6 1.4 1.4 3.4 1.3 4.5 1.3 1.2 0 6.8-.8 7.6-1 .8-.4 1.1-.3 1.6 0 2.1.7 5 1 6.3-3.2 1.1-4-1.7-3-2-2.7-.4.1-.9 0-.7-.3.5-1-.2-.9-.7-1-1.1 0-2.6 1.2-3.1 1.6-.5.4-1 .4-1.2.3-1.5-.7-6 .4-7.4-2.1.1-.7-1.2-10.6-1.8-12.3-.2-.4-.3-1 .2-1.7 1.1-1.7 4.3.2 6 .1 2 0 2.4-.9 3-1.6.5-.7.9-.3 1.2-.5.4-.2 0-.7.1-1 .2-.2.3 0 .7-.4.3-.3 0-1 .1-1.2.5-.8 1.9-.2 1-2.2-.4-1 .2-2.3.9-3 1-1.4 4.8-6.8-2-12.4-6.5-5.4-13-5-17.3-.4-4.2 4.6-2 11.3-1.6 13 .4 1.8-.9 3.4-2.3 4.1a33 33 0 0 0-5.8 4c.3-14.3 9-27 22.4-32.3a18 18 0 0 0 2 2c-1.6 1-4.8 4-4.8 4a11 11 0 0 0 1.7.4l4.2-3.4c1 .8 2.2 1.5 3.4 2l-2.3 4.2a17.8 17.8 0 0 0 1.3.8l2.5-4.4c1.5.5 3 .7 4.6.8v6.2l-4-.2-.6-.1.3.5.6 1v.1h.2l3.5.2V30h1.6v-2.6c2.2 0 4.1-.2 6.4-.4h.1l2-1.8h-1c-2.5.4-4.6.5-6.5.6h-1v-7a36 36 0 0 0 8.3-1.2 126 126 0 0 1 2.2 6.3l1.5-.4-2.2-6.3c2.3-.7 4.6-1.7 6.7-2.9 1.7 2.2 3.2 4.5 4.4 6.9l-3 1.2c1.5.2 2.7.6 2.7.6l1-.4.4 1 2 .8-.2-.5-.8-2c2-1 4.2-2.2 6.2-3.6a35.7 35.7 0 0 1-8.3 48zm-25.6-64a32 32 0 0 0-6.3 3.4L334.2 4a37 37 0 0 1 8-1.8zm-2.2 6c-1-.5-2-1-2.8-1.6 2-1.4 4.1-2.5 6.4-3.4a54.7 54.7 0 0 0-3.6 5zm5.3-4.7v5.9c-1.3 0-2.6-.3-3.8-.7 1.2-1.8 2.4-3.5 3.8-5.2zm1.6 7.4c1.6 0 3.1-.3 4.7-.8a52 52 0 0 1 3 5.9c-2.5.6-5.1 1-7.7 1v-6zm0-7.5a53 53 0 0 1 3.8 5.3 16 16 0 0 1-3.8.7v-6zm8.2 3.2c-1 .6-1.9 1.2-2.9 1.6a58 58 0 0 0-3.6-5c2.3.9 4.4 2 6.5 3.4zM358 4c-.5.6-1 1.2-1.7 1.7a38 38 0 0 0-6.2-3.5c2.7.3 5.3 1 7.9 1.8zm4.4 9c-2 1.1-4.1 2-6.3 2.7-.9-2.1-2-4.1-3.1-6.1a17 17 0 0 0 3.4-2c2.2 1.6 4.2 3.4 6 5.5zm-2.9-8.4c3 1.2 5.8 2.8 8.4 4.8l-4.1 2.9c-1.9-2.1-4-4-6.2-5.7l1.9-2zM375.2 17c-1.9 1.3-4 2.4-6 3.4a39 39 0 0 0-4.5-7c1.6-.9 3-2 4.4-3a32 32 0 0 1 6.1 6.6zM346.1.6a37.4 37.4 0 1 0 0 74.7 37.4 37.4 0 0 0 0-74.7zm-40.7 9.9l-.6.5c-2.2 2-7.2 7-6.4 12.7a64.4 64.4 0 0 0 .3 1.5l.7-.7c3-2.8 5.4-7.5 6.3-13l.3-1.5-.6.5m-10.2 9.7l-.2.7c-.4.9-1 2.9-1.3 5.5-.5 3.7-.4 9 2.8 12.8l.4.5.3.5.5-2.4c.5-4.2-.2-13-1.7-17l-.5-1.3-.3.7m-3.7 15.1v.7c-.3 3.8-.1 13.1 7.4 18l1 .6-.1-1a46.8 46.8 0 0 0-7.4-17.9l-.8-1v.6m1.2 16.7l.1.6c1.1 5.4 6.2 14 14 16.6l1.1.3-.4-1c-1.4-4-9-13.4-13.8-16.4l-1.1-.7.1.6"/>
                    <path d="M308.6 18.5l-.7.4c-5.8 3.6-8.5 7.9-8.3 13.2v1.2l.9-.7a35 35 0 0 0 8.2-13l.5-1.4-.6.3m-3.5 11.7l-.4.4c-1.5 1.4-6.3 6.6-6 13 .1 1 .4 2 .7 3l.4 1 .6-.8a36.3 36.3 0 0 0 5.2-15.8v-1.2l-.5.4m.3 11l-.4.5a18.8 18.8 0 0 0-3.6 10.8c.1 2.5 1 5 2.4 7.2l.6.7.4-.8A38.6 38.6 0 0 0 306 42l-.3-1.2-.3.5m2.8 11.7l-.2.5a21 21 0 0 0-1 6.9c.2 4.9 2.4 8.8 6.5 11.4l.7.5.2-1v-.7c0-4-3-14.1-5.4-17.2l-.6-.9-.2.5M300 68.7l.3.5c3.1 5.3 8.4 12 18.4 10.3l.8-.1-.4-.7c-1.9-2.8-14-9.6-18.3-10.3l-1.1-.2.3.5zM314.7 82l-1.5.5 1.5.6a30.9 30.9 0 0 0 18.8 1.8 9.7 9.7 0 0 0 4.1-2.8c8.1.8 15.7 7.6 20.1 13.1l.3.3.3-.1c.5-.2 1.3-.8 1.6-1.1l.3-.4-.3-.4c-4.6-6-11.8-9.7-12.1-9.9-6.5-3.2-18-5.6-33-1.5m.2-16.9l.1.5c1 6 3.4 13.8 13.5 13h.7l-.2-.7a53 53 0 0 0-13.2-12.8l-1-.5.2.5M386.4 10l.2 1.5c1 5.5 3.3 10.2 6.3 13l.7.7.3-1.1v-.4c.8-5.6-4.2-10.8-6.4-12.7l-.6-.5-.5-.5m10.5 9.5l-.6 1.3c-1.5 4-2.2 12.8-1.7 17l.5 2.4.4-.5.3-.5c3.2-3.9 3.3-9.1 2.9-12.8a26 26 0 0 0-1.3-5.5l-.3-.7-.2-.7m3.9 15.1l-1 1.1c-3 3.8-7.1 14.3-7.3 17.9v1l.9-.5c7.5-5 7.7-14.3 7.5-18v-.8l-.1-.7m-1.2 16.8l-1 .7a48.6 48.6 0 0 0-14 16.4l-.3 1 1-.3c8-2.5 13-11.2 14-16.6l.2-.6.1-.6M383.5 18l.4 1.4a34 34 0 0 0 8 13.2l.8.7v-1.2c.4-5.3-2.3-9.7-8-13.3l-.6-.4-.6-.4m3.3 11.8V31a36 36 0 0 0 5.1 15.8l.7.9.3-1c.4-1.1.6-2.2.7-3.2.4-6.3-4.5-11.5-6-12.9l-.4-.4-.4-.4m-.2 10.9l-.3 1.2a38.6 38.6 0 0 0 1.2 17.8l.5.7.5-.7a14 14 0 0 0 2.4-7.2c0-3.5-1.2-7.2-3.6-10.8l-.3-.5-.4-.5M384 52.5l-.7.9a45.5 45.5 0 0 0-5.4 18l.2.9.7-.5a13 13 0 0 0 6.5-11.4c0-2.2-.3-4.5-1-6.9l-.2-.5-.1-.5m8.7 15.7l-1.2.2c-4.3.7-16.4 7.5-18.3 10.3l-.4.7.8.1c10 1.7 15.3-5 18.4-10.3l.4-.5.3-.5z"/>
                    <path d="M344.5 83.6a40 40 0 0 0-12.1 10l-.3.3.3.4c.3.3 1.1.9 1.6 1l.3.2.3-.3c4.4-5.5 12-12.3 20.1-13 1.3 1.2 2.3 2.1 4 2.7 4.7 1.6 12.6.8 19-1.8l1.5-.6-1.6-.4a47.3 47.3 0 0 0-33 1.5m32.8-18.9l-1 .5A52.9 52.9 0 0 0 363.2 78l-.1.6h.6c10.1 1 12.5-6.9 13.5-12.9v-.5l.2-.5m-257 20H131V28h-10.7v56.7zm-1-69.9H132V3.2h-12.7v11.6zM39.5 28h10.7v56.7H39.7v-8.3h-.2c-4.3 7-11.5 10-19.4 10-11.9 0-18.7-9-18.7-20.4V28h10.8v33.6c0 9.8 2.2 17 12.5 17 4.4 0 10.4-2.2 12.6-8.1a42 42 0 0 0 2.2-13.3V28m32.1 8.4h.2c3.6-7 11.5-10 17.2-10 3.9 0 21.4 1 21.4 19.2v39.1H99.7V49.1c0-9.4-4-14.5-13-14.5 0 0-5.9-.3-10.4 4.2-1.6 1.6-4.5 4-4.5 15.1v30.8H61.1V28.1h10.5v8.3M176 46.2c-.6-7-4-12-11.6-12-10.2 0-14 8.9-14 22.1 0 13.3 3.8 22.1 14 22.1 7 0 11.5-4.6 12-12.7h10.7c-1 12.7-10.3 20.4-22.8 20.4-18 0-25.2-12.7-25.2-29.3 0-16.5 8.3-30.3 26.1-30.3 11.9 0 20.9 7.5 21.4 19.7H176m55.5 4.8c.3-9.5-4-16.8-14.3-16.8-8.9 0-14.1 7.5-14.1 16.8h28.4zm-28.4 7.3c-.8 9.9 3.2 20.1 14 20.1 8.4 0 12.5-3.2 13.8-11.4H242c-1.6 12.8-11.5 19-25 19-18 0-25.3-12.7-25.3-29.3 0-16.5 8.4-30.3 26.2-30.3 16.8.4 24.7 11 24.7 26.6v5.2H203zm51.7 26.2v-49h-9.7v-7.3h9.7V16C255.1 3.8 264.4.5 272.4.5c2.6 0 5 .7 7.6 1.1v8.9c-1.8-.1-3.6-.4-5.4-.4-6 0-9.5 1.6-9.2 7.8v10.3h13v7.4h-13v48.9h-10.6M1.2 125.6H397v-2.1H1.2zm6.6 75v-31.9H.6v-3.9h7.2v-7.6c0-6.1 2.5-8.9 8.6-8.9 1.4 0 2.8.5 4 .8v3.4c-.8-.1-1.7-.3-2.6-.3-5.8 0-6 3-5.7 8v4.6h8v4h-8v31.8H7.8m30.6-32.9c-8.6 0-12 8.4-12 15s3.4 15 12 15c8.7 0 12-8.4 12-15s-3.3-15-12-15zm16.7 15c0 9.4-5.3 19-16.7 19-11.3 0-16.6-9.6-16.6-19s5.3-19 16.6-19c11.4 0 16.7 9.6 16.7 19zm10.5 17.9h-4.3v-27.7c.1-2.8-.2-5.6-.3-8h4.4l.2 5.2h.1a9.2 9.2 0 0 1 8-6.3h4.4v4.2l-2.7-.3c-6.3 0-9.7 4.5-9.8 11.4v21.5m56.2-20.8c-.5-7-4.2-12.1-11.6-12.1-7 0-10.7 5.8-11.3 12h22.9zm-23 3.9c.1 7.6 3.6 14 12.4 14 5 0 9.2-3.6 10.3-8.5h4.5c-2.2 8.5-7.6 12.4-16.2 12.4-10.7 0-15.7-9.1-15.7-18.9 0-9.7 5.4-19 16-19 12 0 16.3 8.8 16.3 20H98.8zm33.4-18.9l12.3 29.9 11.9-29.9h4.7l-14.2 35.8h-4.8l-14.6-35.8h4.7m57.4 15c-.5-7-4.2-12.1-11.6-12.1-7 0-10.7 5.8-11.3 12h22.9zm-23 3.9c.1 7.6 3.6 14 12.4 14 5 0 9.2-3.6 10.3-8.5h4.5c-2.2 8.5-7.6 12.4-16.2 12.4-10.7 0-15.6-9.1-15.6-18.9 0-9.7 5.3-19 16-19 11.9 0 16.2 8.8 16.2 20h-27.6zm38.5 16.9H201v-27.7c0-2.8-.3-5.6-.4-8h4.4l.2 5.2h.2a9.2 9.2 0 0 1 8-6.3h4.3v4.2l-2.6-.3c-6.4 0-9.7 4.5-9.9 11.4v21.5m21.6-35.8l12 29.9 12-29.9h4.6l-19.7 49.4H231l5.4-13.6-14.8-35.8h5.2m69.3 11c-.3-5.5-3.8-8.1-9.7-8.1-6.6 0-10.6 6.8-10.6 15 0 8.1 4 15 10.6 15 5.5 0 9.4-3.4 9.7-8.3h4.6c-1 8.2-5.8 12.2-14 12.2-10.6 0-15.6-9.1-15.6-18.9 0-9.7 5.4-19 16-19 7.3 0 13.3 4.5 13.6 12h-4.6m14.9-5.5h.1c2.5-4.4 6.6-6.4 11.2-6.4 11.7 0 12.6 10.3 12.6 14.4v22.4h-4.3v-23.1c0-6.2-3.5-9.8-9.4-9.8-7 0-10.2 5.9-10.2 12.3v20.6h-4.3v-51.4h4.3v21m31.1 30.4h4.3v-35.8H342v35.8zm-.4-46h5v-5.4h-5v5.3zm13.1 46h4.2v-51.4h-4.2zm26.2-32.9c-8.1 0-10.8 7.5-10.8 14.4 0 6.6 2 15.6 10.1 15.6 9.4 0 12.2-7.7 12.2-15.9 0-7.2-3.2-14.1-11.5-14.1zm11.7 27.6l-.2-.3a14.3 14.3 0 0 1-12.2 6.6c-10.6 0-14.7-10-14.7-19 0-9.3 4-18.8 14.7-18.8 4.7 0 9.7 2.2 12.2 6.4l.2-.1v-21h4.2v43.4c0 2.8.2 5.7.4 8h-4.4l-.2-5.2z"/>
                  </g>
                </svg>
              </div>
            </div>
            <div class="Grid-cell Grid-cell--md1of2">
              <div class="Text">
                <h1 class="Text-h2" style="margin-top: 0">Nominations</h1>
                <p>The Goalkeepers, Global Goals Awards 2018 will tell the stories of remarkable individuals taking action to bring the Goals to life and to help achieve them by 2030. This year the focus is on finding emerging young influencers focused on youth initiatives, who are creating demonstrable change in a specific Goals related area.</p>
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
