const html = require('choo/html')
const Component = require('nanocomponent')
const view = require('../components/view')

const WORDS = ['MENTOR', 'HUMAN', 'PHILOSOPHER', 'CROWDSOURCER', 'POET', 'CHANGEMAKER', 'ENVOY', 'DREAMMAKER', 'ACTIVIST', 'VISIONARY', 'INNOVATOR', 'HUMANITARIAN', 'ENTREPRENEUR', 'FEMINIST', 'DISRUPTOR', 'GIVER', 'ATHLETE', 'FOUNDER', 'JOURNALIST', 'DEFENDER', 'WRITER', 'EDUCATOR', 'ADVOCATE', 'SURGEON', 'INVENTOR', 'TEACHER', 'DREAMER', 'SISTER', 'LAWYER', 'MOTHER', 'LEADER', 'PHILOSOPHER', 'DREAMMAKER', 'DISTRUPTOR', 'STORYTELLER', 'CHAMPION', 'MENTOR', 'INNOVATOR', 'VISIONARY', 'ENTREPRENEUR', 'ADVOCATE', 'SURGEON', 'CHAMPION', 'FOUNDER', 'ATHLETE', 'JOURNALIST']

module.exports = class Home extends Component {
  constructor (id, state, emit) {
    super(id)
    const createElement = view(id, this.view.bind(this))
    this.createElement = function (state, emit, render) {
      this.route = state.route
      return createElement(state, emit, render)
    }
  }

  static identity (state) {
    return 'vote'
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
          <div class="Space Space--textBlock Space--textBlockFirst">
            <div class="Text Text--center Text--growing">
              <img src="/goalkeepers-logo.png" style="background: none; max-width: 460px; transform: translateX(5%);">
              <div style="display: flex; justify-content: center; align-items: center; transform: translateX(-3%);">
                <svg width="1467" height="425" viewBox="0 0 1467 425" style="width: 150px; height: auto; margin: 0 16px; transform: translateX(20px);">
                  <defs>
                    <path id="a" d="M.1.2h1466.5v423.7H.1z"/>
                  </defs>
                  <g fill="none" fill-rule="evenodd">
                    <path fill="#1A1919" d="M450 39.6c6.7 0 12.3-5.4 12.3-12.4 0-6.5-5.6-11.5-12.2-11.5h-13.8v23.9h13.8zM421 3.4c0-1.2.9-2.2 2.2-2.2H451a26.5 26.5 0 0 1 26.6 26.2c0 14.7-12 26.6-26.5 26.6h-14.8v28c0 1.2-1 2.2-2.2 2.2h-11c-1.2 0-2.2-1-2.2-2.2V3.4zM549.6 39a12 12 0 0 0 11.7-12.1c0-6.3-5.4-11.5-11.7-11.5h-19.3V39h19.3zM514.8 3.4c0-1.2 1-2.2 2.2-2.2h34a25.7 25.7 0 0 1 25.8 25.4c0 11-7.3 19.8-17.6 24l16.2 30c.9 1.6 0 3.5-2 3.5H561a2 2 0 0 1-1.9-1l-15.8-31.4h-13.1v30.2c0 1.2-1 2.2-2.3 2.2H517c-1.3 0-2.2-1-2.2-2.2V3.4zm128.6 66.5a27.3 27.3 0 0 0 0-54.5 27.2 27.2 0 1 0 0 54.5zm0-70a42.6 42.6 0 1 1 0 85.4 42.3 42.3 0 0 1-42.6-42.5A42.5 42.5 0 0 1 643.4 0zM711 73.7l6-6.3c1.4-1.2 2.6-1 3.6.1 1.6 1.7 4 3.8 7.9 3.8 4.6 0 9.4-3.8 9.4-12V3.5c0-1.2 1-2.2 2.3-2.2h11.1c1.3 0 2.3 1 2.3 2.2v56c0 16.4-11 26-24.9 26a23 23 0 0 1-18-8.7c-.6-1-.5-2.2.2-3m85.7-70.4c0-1.2 1-2.2 2.3-2.2H847c1.3 0 2.3 1 2.3 2.2v9.7c0 1.2-1 2.3-2.3 2.3h-35v19.4h29.2c1.2 0 2.2 1 2.2 2.3v9.8c0 1.3-1 2.3-2.2 2.3H812v20.7h35.1c1.3 0 2.3 1 2.3 2.3v9.7c0 1.2-1 2.2-2.3 2.2h-48.2c-1.3 0-2.3-1-2.3-2.2V3.4M926.4 0c12 0 20.6 3.8 28.7 11 1 1 1 2.4 0 3.3l-7.1 7.5c-.9 1-2 1-3 0a28 28 0 0 0-18.3-7 26.9 26.9 0 0 0-26.4 27.6A26.8 26.8 0 0 0 945 63c1-.8 2.3-.7 3 0l7.3 7.6c1 .8.7 2.4-.1 3.2a42.5 42.5 0 0 1-71.6-31A42.7 42.7 0 0 1 926.4 0"/>
                    <g transform="translate(0 1)">
                      <mask id="b" fill="#fff">
                        <use xlink:href="#a"/>
                      </mask>
                      <path fill="#1A1919" d="M1005.6 14.4h-18.2c-1.3 0-2.2-1-2.2-2.3V2.4c0-1.2 1-2.2 2.2-2.2h51.8c1.3 0 2.3 1 2.3 2.2v9.7c0 1.2-1 2.3-2.3 2.3h-18.1v66.5c0 1.2-1 2.2-2.3 2.2h-11c-1.2 0-2.2-1-2.2-2.2V14.4" mask="url(#b)"/>
                      <path fill="#DC3943" d="M599.6 268.1l1.2 1.2c8.8-8 17.6-16 26.2-24.1 1-1 1.6-2.7 2-4.1.7-3.5-.8-4.7-4.1-3.2-2.1.8-4.3 2-5.8 3.6-7.2 7.5-12.2 16.6-18.6 24.7l-1 2zm-184.3-36.6c-6.9.5-13.9.4-20.6 1.7-8.6 1.7-17.2 4.1-25.4 7.2a94.5 94.5 0 0 0-27.4 16.8 199 199 0 0 0-33.9 39c-7 9.9-12.4 20.7-17.9 31.4a393.5 393.5 0 0 0-14.6 30.8c-3.1 7.4-5.2 15.3-7.4 23-2.3 8.4-8.5 12.7-16 15.4-4 1.5-8.2 1.4-11.6-2.5-1.8-2.1-5.1-3.3-6.4-5.6-1-2 0-5.1-.1-7.7a489 489 0 0 0-3-55.5c-1.2-9.5-3.7-18.9-5.8-28.3-.4-2-1.3-3.9-2-6.2-5.1 3.8-9.9 4.5-15.2 1.8-4.5-2.2-9.3-3.8-13.8-6-9.8-4.8-19.7-9.6-29.3-14.8-8-4.5-16.9-5.4-25.6-6.7-5.8-.8-11.6-2.8-17.7-1.4-6.8 1.5-13.8 2.4-20.6 3.8-1.1.3-2.3 1.5-3 2.5l-6 10c-4.4 7.1-8.8 14.3-13.4 21.4a24 24 0 0 0-4.4 10.4c4.9 1 9.6.7 14.3.6 7.1 0 14.3 0 21.4.5 7.5.5 12.7 4.9 16.5 11.1 1.3 2.1.9 3.9-.7 5.8-3.7 4.4-8.4 5.8-13.9 5.6-7.3-.2-14.6-.5-22-.4-7.2 0-14.5.6-21.7 1-2.3.1-4.6.7-5.7 3.2-4.7 11-12.7 19.7-19.6 29.2l-3 4.3c1.4.3 2.4.8 3.4.6 16.3-2.9 32.7-1.9 49-2 5.5 0 10.9.6 16.3.4 6.7-.2 15.8 7 17.7 15.2 1 4.4-.5 7.1-4.7 9.1a18.2 18.2 0 0 1-11.2 1.5c-9.3-1.5-18.7-3.2-28-3.6-8.7-.3-17.4.6-26 1.6-7 .8-14 2.5-21 3.8-1.2.2-2.4.4-3.3 1-5.3 3-11.1 2.6-16.8 3.2l-7 .5c-5.2.4-8.2-2.3-8.2-7.7 0-8 1.7-15.4 6.3-22.3 6.4-9.4 12-19.3 18-29 2.1-3.6 4.6-7 6.7-10.7.7-1.4 1.3-3.3 1-4.7-1.7-6.8.2-11.4 6.7-13.3 3.3-1 5-3 6.3-5.4 5-9 9.7-18 14.5-27 .3-.4.2-1 .5-2.2l-11 4.3c-3 1.2-6 2.4-9 3.8-5.9 2.8-8.3.4-9.6-5.9-1.2-5.6-.3-11.2 5.3-15.4 9-7 19-12.6 29-17.8 8.5-4.4 17.8-7.2 27-10.1 12.8-4 25.9-5.6 39-6.5a80 80 0 0 1 32.4 5.2c11.6 4.2 23 9.2 34 14.7 5.1 2.7 9.3 7.3 14 11l5 3.8c-1-3.5-1.9-6-2.5-8.6-1.1-4.8.7-8.2 5.6-8.7 10.2-1 19.4.9 23.8 12.4 4 10.4 5.5 21 7.5 31.8.7 3.4 1.6 6.7 2.2 10.1l2.9 17.6c3.7-6.2 6.8-11.7 10.2-17a417 417 0 0 1 11.3-16.7c4.4-6 9.4-11.7 13.2-18.2 5.4-9 12.9-16.4 20.2-23.6 9.3-9.3 20.4-16.4 32.3-22.1a104.7 104.7 0 0 1 41.7-10.5c10.5.1 21.2-.4 31.7 2 .9.2 1.9.3 2.8.3 3.6 0 7 .3 9.2 4.1 3.5-2 6.4-4.6 9.8-5.6 7-2.2 14.4-4 21.7-5 5-.8 10.3-.3 15.4.1 4.8.4 9.5 1.3 14.2 2.2a78.9 78.9 0 0 1 22.2 7.9c2.3 1.2 5 1.8 7.5 2.9 6.5 2.9 13 5.6 19.3 9 4 2.2 7.6 5.2 11 8.4 6.6 6.4 13 13.1 19.4 19.7.2.2.7.2 1.6.6l6-7.4.8-1.5c5.6-8 10.7-16.2 16.8-23.7a62 62 0 0 1 18.8-16c8.8-4.4 23.8-4.4 31.7 2.2 3.7 3 7.3 6 10.1 10.1 6 8.6 5.4 23.4-.8 29.8-5.5 5.6-9.7 12.4-15.3 18-5 5-11.1 8.8-16.7 13.2l-8.7 7c10.3 8.5 20.3 16.5 30.1 24.8 7.8 6.6 15.7 13.1 22.6 20.5 7.4 7.9 13.7 16.7 20.4 25.2 3.7 4.6 7.3 9.4 10.7 14.2 1.9 2.7 3.4 5.7 4.7 8.7 1 2.5 1.2 5.4-1.1 7.5-2.5 2.1-5.2 1.8-8.1.5a59.1 59.1 0 0 1-20.2-17c-9.5-11.4-18.3-23.5-29.8-33-10.4-8.5-20.7-17.4-33-23.4-6.1-3.1-12-6.7-18.3-9.6-4.1-2-8.6-3-13.3-4.5l-14.9 26.9c-3.9 6.9-8 13.6-11.8 20.5-3.7 6.7-7.6 13.4-10.9 20.3-2.6 5.5-7.3 8.9-11 13.3-.8.9-3.4 1.1-4.7.6-3.3-1.5-6.3-3.6-9.4-5.6-2-1.2-3.7-2.7-5.6-4-1-4 .3-7.2 2.9-10.6a218 218 0 0 0 13-20.3c7-12.2 13.8-24.5 20.7-36.7l11.2-20.3c-.8-.5-1.9-1.4-3.1-1.8-3.8-1.3-5.4-4.5-6.3-7.7a50.5 50.5 0 0 0-15.8-23.8c-4.2-3.9-9-7.3-13.6-10.7a58.9 58.9 0 0 0-22.5-8.6 90.3 90.3 0 0 0-51 1.7 92 92 0 0 0-29 16c-2.4 2-4.4 2-6.4-.6-.7-1-1.5-1.7-2.2-2.6-3-4-3.1-7.2 0-11 1.1-1.5 2.6-2.8 3.9-4.2l4.9-5.3-.8-1.7zm868.1 80.9c-3.8-.7-7.1-1.5-10.5-1.8-10.5-1-21.1-1.8-31.6-2.9-2.4-.2-5-1-7-2.3-3.6-2.1-3.8-4.2-2-7.8 2.1-4.6 6-7.2 10.7-7.9 7-1 14.2-1.8 21.3-1.9 8.2 0 16.5.8 25.6 1.2 2-9 4-18.3 6.2-27.5l6.7-27.9-7.7-5.4a30 30 0 0 1 17.2-14c7.3-2.4 14.2-6 21.5-8.4 8.2-2.6 16.5-5 25.3-5.6 9.2-.7 18.3-2.4 27.4-4a82 82 0 0 1 25.9.2c8.2 1.3 16.5 2 24.6 3.6 6.4 1.3 12.6 3.5 18.8 5.4 3.8 1.2 6.5 4.2 9 7a7 7 0 0 1-4.6 11.8c-4.4.4-8.8 0-13.2-.2-.4 0-.8-.2-1.1-.1-7.3 1-14.1-1.2-21-2.7-3.2-.7-6.3-2.3-9.5-2.6-7.4-.6-15-.8-22.4-1-6.5-.2-13-.4-19.5.2-9 .7-18 .9-26.5 4.6-3.2 1.3-7.1.9-10.5 1.3l-19.3 71.2c4.2 2.8 9.3 2.9 14.1 3.9 13.4 2.8 26.7 6.2 39.3 11.7 6.3 2.8 13 5 19.3 7.7 2.6 1 5.1 2.7 7.2 4.7a16 16 0 0 1 4.2 6c3.3 8.4-.4 12.7-9.4 11a488 488 0 0 1-48-12c-11-3.2-22-5.6-33.2-8.4l-17.6 64 6.5-2a166.7 166.7 0 0 1 78.3-11.3c4 .5 8 1.3 12 1.6 7 .4 12.3 4.2 17.6 8 3.8 2.9 2.6 7.9-2.1 9.3a51.6 51.6 0 0 1-18.9 1.5c-10.6-.7-21.1.4-31.5 2.9-12.4 3-24.2 7.7-36 12.3-11.5 4.4-23.2 8.2-34.5 13a70 70 0 0 1-16.5 5c-3.9.6-7.2-.1-10-3.1-3.2-3.6-3.3-4-.6-8.3.6-1 1-2 1.4-3.1l10.1-39.7c2.5-9.5 4.7-19.1 7.3-28.6 1-3.4 2.6-6.7 4-10 .1-.4.4-.7.4-1.1l2.8-17.5" mask="url(#b)"/>
                    </g>
                    <path fill="#DC3943" d="M970.8 260.8c-5-2.9-11-2.2-17.3-2.2-7.1 0-13.2 2.3-18.7 6.2-9 6.6-17.6 13.6-26.4 20.4l-1.7 1.6c-8.5 10.4-17.7 20.3-24.3 32.2a95 95 0 0 0-6.9 15.8c-1.2 3.8-1.2 8-1.8 12a23 23 0 0 0 8.7 20c7.6 5.2 15.4 3.3 22.3-.6a120.6 120.6 0 0 0 40.2-35.9 800 800 0 0 0 16.6-24.3c2.3-3.5 4.4-7.2 6-11 2.5-6 4.6-12 6.6-18 1.4-4.1 2-8.2-1.9-11.7-1-.8-.9-2.6-1.4-4.5zm29.4 14.3a69 69 0 0 1-11.2 34.7 255.9 255.9 0 0 1-40.4 51c-11 10.7-23 20.5-37.7 26.2a663 663 0 0 0-16.6 6.5 25.7 25.7 0 0 1-21.9-1.5 48.6 48.6 0 0 1-20.7-18.8c-1-1.6-1.7-3.5-2-5.3a61.3 61.3 0 0 1 1.6-35.2c5.2-12.8 11.8-24.7 18.1-36.8.4-.7.8-1.4 1.3-1.9l18.6-18c.6-.6 1.3-1 1.7-1.6 10.6-13.2 25.7-20 40.4-27.2 6-3 12.2-5.7 18.6-7.6 4.5-1.3 9.6-2 14.2-1.3 9 1.2 17.4 4 25 9.6a25.1 25.1 0 0 1 11 23.7v3.5zm165.3 72.3c1-2.7 2-4.8 2.6-7 2.5-9.2 4.7-18.6 7.4-27.9 3.3-11 6-22.2 11.9-32.4 3.1-5.5 5.3-11.5 8.5-17 3.3-5.8 7.3-11.3 11-16.9l4.6-6.6c2.3-3.5 4.6-7 8.6-9.1 1.7-.9 2.8-2.6 4.3-3.8 4.5-3.9 9-7.9 13.7-11.4 4-3 8.9-3.9 13.7-3.8 2.3 0 5 1.3 6.5 3 2 2 .6 4.7-1 6.8-3.4 4.8-7 9.4-11.7 13.3a67.4 67.4 0 0 0-17 19.4c-5.8 10.4-12.3 20.5-18.1 30.9-2.2 4-3.5 8.5-5.1 12.8l-3.2 8c-4.9 12-7 24.8-10.3 37.2-4.1 16.5-5.9 33.4-8.7 50-.6 3.5-1.3 6.7-3.8 9.6-3 3.5-5.9 6-10.8 3.2-1.2-.7-2.9-.6-4.8-.9l.7-3.5c-4.4-8-9.8-15-12.4-22.8-2.7-8.2-5-16.6-9.3-24.1-4.1-7.3-4.5-15.7-8.2-23l-1-2.7c-4.1-7.8-8-15.7-12.2-23.4-6-11.2-13.4-21.5-22.5-30.5-5.6-5.6-10-12.2-15.1-18.3-1.3-1.5-3-2.9-4.8-4-4.7-2.6-9.5-4.9-14.2-7.5-10.4-5.8-7.4-14.7-.4-20.7 1.9-1.6 5.9-1.3 8.8-1 5.3.8 9.6 4 13.7 7.1 6.3 5 13.3 9.2 17.6 16.3.4.7 1 1.2 1.7 1.6 6.7 4.9 10.8 11.9 15.5 18.4 7.8 10.8 13.4 22.8 19.2 34.8 7.3 15 15.3 29.7 23 44.6.2.3.6.5 1.6 1.3m-370.2-60.8c-9 2.8-17.8 7-27.5 7a77 77 0 0 1-17.1-2.6c-7.8-1.8-15.6-4-23.3-6.5a28 28 0 0 1-8-4.4c-4.3-3.2-8.5-6.6-12.4-10.3a98.6 98.6 0 0 1-10.5-11.4c-3.8-5-3-11.4 1.5-15.7 3.9-3.8 12.8-3.2 16.1 1.2.7.9 1 2.3 1.9 2.8 9 5.2 15.4 14 25.7 17.3 2.2.7 4.4 1.5 6.6 1.8a69.7 69.7 0 0 0 47.6-10.6l7.8-5c6-3.5 9-9.2 11.3-15.5 1.1-3 2-6.2 3.6-9.1 2.7-5.3 6.4-5.9 11.9-3.1 5.4 2.7 9.7 6.3 11 12.4a14 14 0 0 1 0 7.7c-3.4 8.4-7.5 16.4-11 24.7-2.7 6.4-4.4 13.2-7.3 19.4-4 8.5-4.2 18-7.7 26.5-3 7-5 14.5-7.4 21.8a165 165 0 0 0-3 10c-2 9-4.3 17.9-6 27a210.1 210.1 0 0 1-9.5 34.4c-1.2 3-3 4.8-6.4 4.8-3.4.1-4.3-2.2-5.9-4.6-3.6-5.4-2-11.2-1.6-16.9.8-9.5 2-19.1 3.7-28.6 2-12 4.7-23.7 7.2-35.6l8.7-39m-365.8-27.4c6-2.7 11.7-3.1 17.5-3.4 12-.5 13.9 6.6 13 15-.6 6-3.2 11.7-5.1 17.5-2.4 7.5-5 15-7.6 22.4-1.6 4.5-3.5 9-5.5 14 2 .2 3.4.5 4.9.5l31.7 1.6c2.5.1 5 1 7.2 2 3 1.1 5.9 3 9 3.9 4 1.2 5.6 3.7 5.9 7.5.2 2.4-.6 3.8-2.2 5.9-4.2 5.5-9 6-15.3 5.1-5.4-.7-11 .2-16.7.2-7.8 0-15.7-.3-23.5-.4H434a44 44 0 0 0-3.2 27.4c.4 2.8 2.7 3.6 5 3.8 3 .2 6 .7 8.7.1 7.6-1.6 15-3.7 22.4-5.6 2.6-.6 5.2-1.5 7.8-1.4 3.7 0 7.4 3.3 8 6.5.6 3.5-1 6.3-3.8 8.6-5.4 4.5-12.1 5.7-18.6 7.4A86.2 86.2 0 0 1 434 401a44 44 0 0 1-29.8-13.2 13 13 0 0 1-2.7-6.2c-2-8.6.4-16.8 2.9-24.9l2.1-7.2-13.2-1.1c-5.3-.7-10.7-1.2-16-2.3-4-.9-5.6-3-5.1-7.1.5-4.3 2-8.6 3-12.9a55 55 0 0 1 17-1.5c6.1.4 12.3.5 18.4.7 2.7 0 4-1.2 4.8-3.9 4.1-13.6 8.7-27.1 12.5-40.9 1.4-4.9 1-10.3 1.4-15.5.2-1.9 0-3.8 0-5.9"/>
                    <path fill="#DC3943" d="M1064 253.8c5.2-1.9 9 .4 12.7 4.1 2.4 2.3 3.2 4.3 2.7 7.5-2 13.4-6 26.3-11.1 38.8-2.3 5.7-4.3 11.5-7.3 17-4.4 8.2-9.6 16-14.4 24.1l-5 8.4a9.4 9.4 0 0 1-11.6 3.8c-.8-.3-1.7-1-1.9-1.8-.7-2.6-1.5-5.2-1.6-7.8-.2-2.5.1-5 .7-7.5 3.1-11.9 6.2-23.8 9.6-35.7 3-10.1 6.4-20.2 9.5-30.3.5-1.6.5-3.4.5-5.2a16 16 0 0 1 3-8.6c3.2-5.4 7.2-9 14.3-6.8"/>
                  </g>
                </svg>
                <svg width="401" height="215" viewBox="0 0 401 215" style="width: 150px; height: auto; margin: 0 16px; transform: translateX(20px);">
                  <g fill="#00A3DA" fill-rule="evenodd">
                    <path d="M367.8 66.4c-5-2.7-5.1-6.5-4.8-8 .2-1.3 1.2-.7 1.8-.7 3.3 0 6.7-1 11-5.3a16.6 16.6 0 0 0-1.1-22.7c-8-7.6-16.3-6.3-21.7.5a8.5 8.5 0 0 1-6.2 2.4c-3.5-.1-1.3 2.6-1.3 3.2 0 .5-.5 1-.8.8-1.2-.3-.7 1.4-.7 2 0 .5-.5.8-.8.8-1.4 0-1 1.3-1 1.6 0 .4 0 1-.6 1.3-.4.2-1 1.4-1 2.3 0 1.6 1.5 2.7 3.9 4.5 2.4 1.8 2.7 3.5 2.8 4.7 0 1.3.1 3.2.7 4.6.6 1.5.6 4.5-2.8 4.6-4 .2-11.4 3.4-12 3.6-2.3.9-5.3 1.2-7.7.6l-3.7-3c-.5-1.7.4-3.4 1.2-4.6 1.4 1.4 3.4 1.3 4.5 1.3 1.2 0 6.8-.8 7.6-1 .8-.4 1.1-.3 1.6 0 2.1.7 5 1 6.3-3.2 1.1-4-1.7-3-2-2.7-.4.1-.9 0-.7-.3.5-1-.2-.9-.7-1-1.1 0-2.6 1.2-3.1 1.6-.5.4-1 .4-1.2.3-1.5-.7-6 .4-7.4-2.1.1-.7-1.2-10.6-1.8-12.3-.2-.4-.3-1 .2-1.7 1.1-1.7 4.3.2 6 .1 2 0 2.4-.9 3-1.6.5-.7.9-.3 1.2-.5.4-.2 0-.7.1-1 .2-.2.3 0 .7-.4.3-.3 0-1 .1-1.2.5-.8 1.9-.2 1-2.2-.4-1 .2-2.3.9-3 1-1.4 4.8-6.8-2-12.4-6.5-5.4-13-5-17.3-.4-4.2 4.6-2 11.3-1.6 13 .4 1.8-.9 3.4-2.3 4.1a33 33 0 0 0-5.8 4c.3-14.3 9-27 22.4-32.3a18 18 0 0 0 2 2c-1.6 1-4.8 4-4.8 4a11 11 0 0 0 1.7.4l4.2-3.4c1 .8 2.2 1.5 3.4 2l-2.3 4.2a17.8 17.8 0 0 0 1.3.8l2.5-4.4c1.5.5 3 .7 4.6.8v6.2l-4-.2-.6-.1.3.5.6 1v.1h.2l3.5.2V30h1.6v-2.6c2.2 0 4.1-.2 6.4-.4h.1l2-1.8h-1c-2.5.4-4.6.5-6.5.6h-1v-7a36 36 0 0 0 8.3-1.2 126 126 0 0 1 2.2 6.3l1.5-.4-2.2-6.3c2.3-.7 4.6-1.7 6.7-2.9 1.7 2.2 3.2 4.5 4.4 6.9l-3 1.2c1.5.2 2.7.6 2.7.6l1-.4.4 1 2 .8-.2-.5-.8-2c2-1 4.2-2.2 6.2-3.6a35.7 35.7 0 0 1-8.3 48zm-25.6-64a32 32 0 0 0-6.3 3.4L334.2 4a37 37 0 0 1 8-1.8zm-2.2 6c-1-.5-2-1-2.8-1.6 2-1.4 4.1-2.5 6.4-3.4a54.7 54.7 0 0 0-3.6 5zm5.3-4.7v5.9c-1.3 0-2.6-.3-3.8-.7 1.2-1.8 2.4-3.5 3.8-5.2zm1.6 7.4c1.6 0 3.1-.3 4.7-.8a52 52 0 0 1 3 5.9c-2.5.6-5.1 1-7.7 1v-6zm0-7.5a53 53 0 0 1 3.8 5.3 16 16 0 0 1-3.8.7v-6zm8.2 3.2c-1 .6-1.9 1.2-2.9 1.6a58 58 0 0 0-3.6-5c2.3.9 4.4 2 6.5 3.4zM358 4c-.5.6-1 1.2-1.7 1.7a38 38 0 0 0-6.2-3.5c2.7.3 5.3 1 7.9 1.8zm4.4 9c-2 1.1-4.1 2-6.3 2.7-.9-2.1-2-4.1-3.1-6.1a17 17 0 0 0 3.4-2c2.2 1.6 4.2 3.4 6 5.5zm-2.9-8.4c3 1.2 5.8 2.8 8.4 4.8l-4.1 2.9c-1.9-2.1-4-4-6.2-5.7l1.9-2zM375.2 17c-1.9 1.3-4 2.4-6 3.4a39 39 0 0 0-4.5-7c1.6-.9 3-2 4.4-3a32 32 0 0 1 6.1 6.6zM346.1.6a37.4 37.4 0 1 0 0 74.7 37.4 37.4 0 0 0 0-74.7zm-40.7 9.9l-.6.5c-2.2 2-7.2 7-6.4 12.7a64.4 64.4 0 0 0 .3 1.5l.7-.7c3-2.8 5.4-7.5 6.3-13l.3-1.5-.6.5m-10.2 9.7l-.2.7c-.4.9-1 2.9-1.3 5.5-.5 3.7-.4 9 2.8 12.8l.4.5.3.5.5-2.4c.5-4.2-.2-13-1.7-17l-.5-1.3-.3.7m-3.7 15.1v.7c-.3 3.8-.1 13.1 7.4 18l1 .6-.1-1a46.8 46.8 0 0 0-7.4-17.9l-.8-1v.6m1.2 16.7l.1.6c1.1 5.4 6.2 14 14 16.6l1.1.3-.4-1c-1.4-4-9-13.4-13.8-16.4l-1.1-.7.1.6"/>
                    <path d="M308.6 18.5l-.7.4c-5.8 3.6-8.5 7.9-8.3 13.2v1.2l.9-.7a35 35 0 0 0 8.2-13l.5-1.4-.6.3m-3.5 11.7l-.4.4c-1.5 1.4-6.3 6.6-6 13 .1 1 .4 2 .7 3l.4 1 .6-.8a36.3 36.3 0 0 0 5.2-15.8v-1.2l-.5.4m.3 11l-.4.5a18.8 18.8 0 0 0-3.6 10.8c.1 2.5 1 5 2.4 7.2l.6.7.4-.8A38.6 38.6 0 0 0 306 42l-.3-1.2-.3.5m2.8 11.7l-.2.5a21 21 0 0 0-1 6.9c.2 4.9 2.4 8.8 6.5 11.4l.7.5.2-1v-.7c0-4-3-14.1-5.4-17.2l-.6-.9-.2.5M300 68.7l.3.5c3.1 5.3 8.4 12 18.4 10.3l.8-.1-.4-.7c-1.9-2.8-14-9.6-18.3-10.3l-1.1-.2.3.5zM314.7 82l-1.5.5 1.5.6a30.9 30.9 0 0 0 18.8 1.8 9.7 9.7 0 0 0 4.1-2.8c8.1.8 15.7 7.6 20.1 13.1l.3.3.3-.1c.5-.2 1.3-.8 1.6-1.1l.3-.4-.3-.4c-4.6-6-11.8-9.7-12.1-9.9-6.5-3.2-18-5.6-33-1.5m.2-16.9l.1.5c1 6 3.4 13.8 13.5 13h.7l-.2-.7a53 53 0 0 0-13.2-12.8l-1-.5.2.5M386.4 10l.2 1.5c1 5.5 3.3 10.2 6.3 13l.7.7.3-1.1v-.4c.8-5.6-4.2-10.8-6.4-12.7l-.6-.5-.5-.5m10.5 9.5l-.6 1.3c-1.5 4-2.2 12.8-1.7 17l.5 2.4.4-.5.3-.5c3.2-3.9 3.3-9.1 2.9-12.8a26 26 0 0 0-1.3-5.5l-.3-.7-.2-.7m3.9 15.1l-1 1.1c-3 3.8-7.1 14.3-7.3 17.9v1l.9-.5c7.5-5 7.7-14.3 7.5-18v-.8l-.1-.7m-1.2 16.8l-1 .7a48.6 48.6 0 0 0-14 16.4l-.3 1 1-.3c8-2.5 13-11.2 14-16.6l.2-.6.1-.6M383.5 18l.4 1.4a34 34 0 0 0 8 13.2l.8.7v-1.2c.4-5.3-2.3-9.7-8-13.3l-.6-.4-.6-.4m3.3 11.8V31a36 36 0 0 0 5.1 15.8l.7.9.3-1c.4-1.1.6-2.2.7-3.2.4-6.3-4.5-11.5-6-12.9l-.4-.4-.4-.4m-.2 10.9l-.3 1.2a38.6 38.6 0 0 0 1.2 17.8l.5.7.5-.7a14 14 0 0 0 2.4-7.2c0-3.5-1.2-7.2-3.6-10.8l-.3-.5-.4-.5M384 52.5l-.7.9a45.5 45.5 0 0 0-5.4 18l.2.9.7-.5a13 13 0 0 0 6.5-11.4c0-2.2-.3-4.5-1-6.9l-.2-.5-.1-.5m8.7 15.7l-1.2.2c-4.3.7-16.4 7.5-18.3 10.3l-.4.7.8.1c10 1.7 15.3-5 18.4-10.3l.4-.5.3-.5z"/>
                    <path d="M344.5 83.6a40 40 0 0 0-12.1 10l-.3.3.3.4c.3.3 1.1.9 1.6 1l.3.2.3-.3c4.4-5.5 12-12.3 20.1-13 1.3 1.2 2.3 2.1 4 2.7 4.7 1.6 12.6.8 19-1.8l1.5-.6-1.6-.4a47.3 47.3 0 0 0-33 1.5m32.8-18.9l-1 .5A52.9 52.9 0 0 0 363.2 78l-.1.6h.6c10.1 1 12.5-6.9 13.5-12.9v-.5l.2-.5m-257 20H131V28h-10.7v56.7zm-1-69.9H132V3.2h-12.7v11.6zM39.5 28h10.7v56.7H39.7v-8.3h-.2c-4.3 7-11.5 10-19.4 10-11.9 0-18.7-9-18.7-20.4V28h10.8v33.6c0 9.8 2.2 17 12.5 17 4.4 0 10.4-2.2 12.6-8.1a42 42 0 0 0 2.2-13.3V28m32.1 8.4h.2c3.6-7 11.5-10 17.2-10 3.9 0 21.4 1 21.4 19.2v39.1H99.7V49.1c0-9.4-4-14.5-13-14.5 0 0-5.9-.3-10.4 4.2-1.6 1.6-4.5 4-4.5 15.1v30.8H61.1V28.1h10.5v8.3M176 46.2c-.6-7-4-12-11.6-12-10.2 0-14 8.9-14 22.1 0 13.3 3.8 22.1 14 22.1 7 0 11.5-4.6 12-12.7h10.7c-1 12.7-10.3 20.4-22.8 20.4-18 0-25.2-12.7-25.2-29.3 0-16.5 8.3-30.3 26.1-30.3 11.9 0 20.9 7.5 21.4 19.7H176m55.5 4.8c.3-9.5-4-16.8-14.3-16.8-8.9 0-14.1 7.5-14.1 16.8h28.4zm-28.4 7.3c-.8 9.9 3.2 20.1 14 20.1 8.4 0 12.5-3.2 13.8-11.4H242c-1.6 12.8-11.5 19-25 19-18 0-25.3-12.7-25.3-29.3 0-16.5 8.4-30.3 26.2-30.3 16.8.4 24.7 11 24.7 26.6v5.2H203zm51.7 26.2v-49h-9.7v-7.3h9.7V16C255.1 3.8 264.4.5 272.4.5c2.6 0 5 .7 7.6 1.1v8.9c-1.8-.1-3.6-.4-5.4-.4-6 0-9.5 1.6-9.2 7.8v10.3h13v7.4h-13v48.9h-10.6M1.2 125.6H397v-2.1H1.2zm6.6 75v-31.9H.6v-3.9h7.2v-7.6c0-6.1 2.5-8.9 8.6-8.9 1.4 0 2.8.5 4 .8v3.4c-.8-.1-1.7-.3-2.6-.3-5.8 0-6 3-5.7 8v4.6h8v4h-8v31.8H7.8m30.6-32.9c-8.6 0-12 8.4-12 15s3.4 15 12 15c8.7 0 12-8.4 12-15s-3.3-15-12-15zm16.7 15c0 9.4-5.3 19-16.7 19-11.3 0-16.6-9.6-16.6-19s5.3-19 16.6-19c11.4 0 16.7 9.6 16.7 19zm10.5 17.9h-4.3v-27.7c.1-2.8-.2-5.6-.3-8h4.4l.2 5.2h.1a9.2 9.2 0 0 1 8-6.3h4.4v4.2l-2.7-.3c-6.3 0-9.7 4.5-9.8 11.4v21.5m56.2-20.8c-.5-7-4.2-12.1-11.6-12.1-7 0-10.7 5.8-11.3 12h22.9zm-23 3.9c.1 7.6 3.6 14 12.4 14 5 0 9.2-3.6 10.3-8.5h4.5c-2.2 8.5-7.6 12.4-16.2 12.4-10.7 0-15.7-9.1-15.7-18.9 0-9.7 5.4-19 16-19 12 0 16.3 8.8 16.3 20H98.8zm33.4-18.9l12.3 29.9 11.9-29.9h4.7l-14.2 35.8h-4.8l-14.6-35.8h4.7m57.4 15c-.5-7-4.2-12.1-11.6-12.1-7 0-10.7 5.8-11.3 12h22.9zm-23 3.9c.1 7.6 3.6 14 12.4 14 5 0 9.2-3.6 10.3-8.5h4.5c-2.2 8.5-7.6 12.4-16.2 12.4-10.7 0-15.6-9.1-15.6-18.9 0-9.7 5.3-19 16-19 11.9 0 16.2 8.8 16.2 20h-27.6zm38.5 16.9H201v-27.7c0-2.8-.3-5.6-.4-8h4.4l.2 5.2h.2a9.2 9.2 0 0 1 8-6.3h4.3v4.2l-2.6-.3c-6.4 0-9.7 4.5-9.9 11.4v21.5m21.6-35.8l12 29.9 12-29.9h4.6l-19.7 49.4H231l5.4-13.6-14.8-35.8h5.2m69.3 11c-.3-5.5-3.8-8.1-9.7-8.1-6.6 0-10.6 6.8-10.6 15 0 8.1 4 15 10.6 15 5.5 0 9.4-3.4 9.7-8.3h4.6c-1 8.2-5.8 12.2-14 12.2-10.6 0-15.6-9.1-15.6-18.9 0-9.7 5.4-19 16-19 7.3 0 13.3 4.5 13.6 12h-4.6m14.9-5.5h.1c2.5-4.4 6.6-6.4 11.2-6.4 11.7 0 12.6 10.3 12.6 14.4v22.4h-4.3v-23.1c0-6.2-3.5-9.8-9.4-9.8-7 0-10.2 5.9-10.2 12.3v20.6h-4.3v-51.4h4.3v21m31.1 30.4h4.3v-35.8H342v35.8zm-.4-46h5v-5.4h-5v5.3zm13.1 46h4.2v-51.4h-4.2zm26.2-32.9c-8.1 0-10.8 7.5-10.8 14.4 0 6.6 2 15.6 10.1 15.6 9.4 0 12.2-7.7 12.2-15.9 0-7.2-3.2-14.1-11.5-14.1zm11.7 27.6l-.2-.3a14.3 14.3 0 0 1-12.2 6.6c-10.6 0-14.7-10-14.7-19 0-9.3 4-18.8 14.7-18.8 4.7 0 9.7 2.2 12.2 6.4l.2-.1v-21h4.2v43.4c0 2.8.2 5.7.4 8h-4.4l-.2-5.2z"/>
                  </g>
                </svg>
              </div>
              <br>
              <br>
              <h1 class="u-hiddenVisually" style="margin: 0;">Global Goals Awards 2018</h1>
              <p style="margin: 0;">Thank you for being part of the Global Goals Awards 2018 judging panel. There are three categories for which we need your vote – the Progress Award, the Changemaker Award and the Campaign Award.</p>
            </div>
            <div class="Text Text--center Text--full" style="margin-top: 72px;">
              <h2 class="Text-h3">We are looking for individuals who</h2>
              <div class="Grid" style="margin-top: 48px;">
                <span class="Grid-cell Grid-cell--sm1of2 Grid-cell--md1of4">Can show how their youth-focused work directly links to one of the 17 Global Goals.</span>
                <span class="Grid-cell Grid-cell--sm1of2 Grid-cell--md1of4">Are courageous, action oriented and optimistic advocates for the Goals.</span>
                <span class="Grid-cell Grid-cell--sm1of2 Grid-cell--md1of4">Have a compelling story that will engage a wider audience and global media.</span>
                <span class="Grid-cell Grid-cell--sm1of2 Grid-cell--md1of4">Can illustrate the human impact that their work has already had.</span>
              </div>
            </div>
            <div class="u-textCenter" style="margin-top: 24px;">
              <a href="/progress" class="Button Button--lg u-inlineBlock">Begin voting</a>
            </div>
            <div class="Text Text--center">
              <br>
              <a href="https://globalgoals.cdn.prismic.io/globalgoals/58f3c451-9623-487d-be74-e8ff2dc3ddac_terms+conditions.pdf" target="_blank">Read the terms and conditions</a>
            </div>
          </div>
        </section>
      </main>
    `
  }
}