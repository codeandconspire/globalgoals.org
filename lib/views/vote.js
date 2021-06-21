const html = require('choo/html')
const Component = require('nanocomponent')
const view = require('../components/view')
const Form = require('../components/form')

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
        <section class="View-section">
          <style>
            .Goalkeepers-logo {
              max-width: 19rem;
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
                font-size: 8rem;
                max-width: 65rem;
              }
            }
          </style>
          <img class="Goalkeepers-logo" width="1800" height="506" src="/goalkeepers-min.png">
          <div class="Goalkeepers-intro">
            <div class="Text Text--growing" style="max-width: none;">
              <h1 class="Goalkeepers-title" >Vote for an inspiring young leader</h1>
              <div style="max-width: 43em">
                <p class="Text-large" style="margin-top: -12px;"><strong>Thank you for being part of the Global Goals Awards 2021 judging panel.</strong></p>
                <p class="Text-large">There are three categories for which we need your vote – the Progress Award, the Changemaker Award and the Campaign Award.</p>
              </div>
            </div>
          </div>
          <div class="Space Space--startShort">
            <div class="Text Text--center Text--full" style="margin-top: 2vh;">
              <h2 class="Text-h3" style="max-width: 11em;font-size: 3rem;margin: auto;">We are looking for young leaders who</h2>
              <div class="Grid" style="margin-top: 48px;">
                <div class="Grid-cell Grid-cell--sm1of2 Grid-cell--md1of4">
                  <div style="max-width: 20em;margin-left: auto;margin-right: auto;">
                    <svg height="100" viewBox="0 0 126 140" style="width: auto;">
                      <g fill="#c5192d" fill-rule="evenodd">
                        <path d="M0 128.6s50.3-29 52.7-31.4a18.8 18.8 0 0 1 16.6-5.6c8.4 1.4 13.5 2.1 17.8 2.7 4.3.5 7 0 7.3 1.4.3 2-2 4-5.3 4.2-3.5.3-9.6-.2-10.8-.1-1.2 0-2.2.4-1.7 1.4.4 1 7.2 1.2 9.2 1.1a41 41 0 0 0 13.7-3.6c3.7-2 10.9-7.1 12-7.7 1.3-.6 3.5-1.6 4.4-.4 1 1.2-.8 3-2.1 4.2-6 5.6-12.6 10.6-19.6 15-6.1 3.3-7.6 3.8-13.8 3.3-6.3-.5-11.3-2.6-14.5-2.2-3.7.5-7.1 2-10 4.3-1.3 1-26.7 24.5-26.7 24.5H0v-11z"/>
                        <path fill-rule="nonzero" d="M64.3 29c1-1.7 2.3-3.3 3.7-4.7L55.8 11c-3.1 3-5.7 6.3-7.8 10l16.3 8zM94 19.8c1.8.9 3.5 2 5 3.2l12-13.3c-3.2-2.8-6.8-5-10.6-6.7L94 19.8zm28.5 4.2L106 32.2c.8 1.9 1.3 3.8 1.6 5.8l18.4-1.7c-.5-4.3-1.7-8.4-3.5-12.3zm-17.9 6l16.4-8c-2-3.7-4.6-7-7.7-10L101 25.2c1.4 1.4 2.6 3 3.6 4.8zM61.4 41.7v-1L43 39v2.7c0 3.5.4 7 1.3 10.3L62 47a24 24 0 0 1-.6-5.2zm41 14.3c-1.2 1.6-2.7 3-4.4 4.2l9.6 15.8c3.6-2.4 6.7-5.4 9.4-8.9L102.5 56zm5.1-14.4c0 1.8-.1 3.5-.5 5.2l17.8 5.2c.8-3.4 1.2-6.9 1.2-10.4V39l-18.5 1.8v.8zM66.5 57L52 67.7c2.7 3.2 5.9 6 9.4 8.3L71 61a24.2 24.2 0 0 1-4.5-4zm-5.2-19c.3-2 .9-4 1.7-5.9L46.6 24c-1.8 4-3 8-3.6 12.4L61.3 38zM105 77.4L95.5 62a23 23 0 0 1-5.5 2.2L93.3 82c4.1-1 8-2.5 11.7-4.7zm1.5-28.4c-.6 1.8-1.4 3.6-2.5 5.2L118.5 65a41 41 0 0 0 5.5-11l-17.5-5zm-19 16a23.7 23.7 0 0 1-6.1 0L78 82.7c4.3.6 8.7.5 13-.1L87.5 65zM86 17.9c2 .1 3.8.5 5.6 1.1L98 2.3C94.1.9 90 0 86 0v17.9zm-7 46.3c-2-.5-3.9-1.2-5.6-2.2L64 77.5A40 40 0 0 0 75.7 82L79 64.2zM77.3 19c1.8-.6 3.8-1 5.7-1V0c-4 .1-8.1.8-12 2.2L77.3 19zM65 54.7C63.9 53 63 51 62.3 49L45 54.1c1.3 4.3 3.2 8.3 5.7 11.9L65 54.7zM70 23a23 23 0 0 1 5-3L68.6 3A41 41 0 0 0 58 9.6L70 23z"/>
                      </g>
                    </svg>
                    <p>Have achieved success in their work specifically in the past year, demons-trating innovation and inclusion in the midst of the pandemic.</p>
                  </div>
                </div>
                <div class="Grid-cell Grid-cell--sm1of2 Grid-cell--md1of4">
                  <div style="max-width: 20em;margin-left: auto;margin-right: auto;">
                    <svg height="100" viewBox="0 0 140 140" style="width: auto;">
                      <g fill="none" fill-rule="evenodd">
                        <path fill="#c5192d" fill-rule="nonzero" d="M35.9 50c1.7-3 3.9-5.7 6.3-8.1L21.6 19.3c-5.2 5-9.6 10.7-13 17L35.8 50zm50.5-16c3 1.4 6 3.3 8.6 5.4l20.6-22.6A70 70 0 0 0 97.4 5.4L86.4 34zm47.2 6.8l-27.3 13.7c1.3 3 2.2 6.3 2.7 9.6l30.5-2.8c-.9-7.1-2.9-14-5.9-20.5zm-29.3 9.7l27.4-13.7c-3.4-6.3-7.7-12-12.8-17L98.3 42.4c2.4 2.5 4.4 5.2 6 8.2zM30.5 70v-2L0 65.5V70c0 5.7.7 11.3 2 16.9l29.4-8.4c-.6-2.8-1-5.6-1-8.5zm70 25c-2.2 2.6-4.7 5-7.5 7l16 26c6-4 11.4-9 15.8-14.6L100.5 95zm9-25a40 40 0 0 1-1 8.3l29.4 8.5c1.4-5.5 2.1-11.2 2.1-16.8l-.1-4.3-30.5 2.8V70zM39.9 95.6L15.6 114a70.2 70.2 0 0 0 15.9 14.4l16-26c-2.8-2-5.3-4.2-7.6-6.8zm-9-31.9c.6-3.4 1.6-6.7 3-9.8L6.5 40.3c-3 6.5-5.1 13.5-6 20.7L31 63.7zm74.5 66.6l-16-26a39 39 0 0 1-9.4 3.8l5.6 30c7-1.5 13.6-4.2 19.8-7.8zm2-47.7c-1 3.1-2.5 6-4.3 8.8l24.4 18.4a70 70 0 0 0 9.4-18.7l-29.5-8.5zM75.7 109a38 38 0 0 1-10.3.2l-5.6 30c7.2 1.1 14.5 1 21.6-.1l-5.7-30zm-3.2-78.5c3.3.2 6.6.9 9.8 1.9l11-28.5A69.6 69.6 0 0 0 72.4 0v30.5zm-11.5 78a39 39 0 0 1-9.7-3.8l-16 26.2c6.2 3.6 13 6.2 20 7.7l5.7-30.2zm-3-76.2c3.3-1 6.7-1.6 10-1.8V0a70 70 0 0 0-21 3.7l11 28.6zM37.3 92c-2-2.8-3.5-6-4.6-9.3L3.2 91.1c2.2 7 5.5 13.5 9.7 19.4L37.2 92zm8.3-53c2.6-2 5.4-3.8 8.5-5.2L43 5.3a70 70 0 0 0-18 11L45.5 39z"/>
                        <path fill="#c5192d" d="M45.2 74.1c1.8.5 2.3-1.5 2.3-1.5l2.8-9.5s.2-.7.7-.6c.5.1.4.9.4.9l-4.9 17.8h4.6V94a2.1 2.1 0 0 0 2.3 2c1.1-.1 2-.9 2-2V81.2h1.2V94a2.1 2.1 0 0 0 2.3 2c1.1-.1 2-.9 2-2V81.2h4.6l-4.4-16c-.2-1 0-2 .4-2.9l2.9-5.2 5.4-9.1 6.3 8.3 3.9 5.5c.4.7.7 1.5.7 2.3v29.8c0 1.3 1.1 2.4 2.4 2.4 1.3 0 2.4-1.1 2.4-2.4V76.3c0-.4.3-.7.6-.7h.1c.4 0 .7.3.7.6v17.6a2.4 2.4 0 0 0 4.7 0V63.4c0-.3.1-.8.6-.8.7 0 .8.5.8.9v10.1c.1.9.9 1.6 1.8 1.5.8-.1 1.5-.7 1.5-1.5V61.8c0-2.9-2.2-5.4-5.2-5.7h-8.4c-1.2.1-2.4-.5-3.1-1.4l-8.1-9.9c-.4-.5-.8-.9-1.3-1.2-.9-.4-1.9-.1-2.3.8l-7.3 11.4c-.7.7-1.6 1.1-2.6 1h-6.5c-2.8 0-4 3.3-4 3.3L44 71.5c.1 0-.5 2.1 1.2 2.6z"/>
                        <path fill="#c5192d" fill-rule="nonzero" d="M86.3 54.5c2.4 0 4.3-1.9 4.3-4.3s-1.9-4.3-4.3-4.3a4.3 4.3 0 0 0-4.3 4.3c.1 2.4 2 4.3 4.3 4.3zm-29.9.3c2.3 0 4.2-1.9 4.2-4.2 0-2.3-1.9-4.2-4.2-4.2a4.2 4.2 0 0 0-4.2 4.2c0 2.3 1.8 4.2 4.2 4.2z"/>
                      </g>
                    </svg>
                    <p>Can show how their work directly links to one of the 17 Global Goals.</p>
                  </div>
                </div>
                <div class="Grid-cell Grid-cell--sm1of2 Grid-cell--md1of4">
                  <div style="max-width: 20em;margin-left: auto;margin-right: auto;">
                    <svg height="100" viewBox="0 0 76 138" style="width: auto;">
                      <g fill="#c5192d" fill-rule="evenodd">
                        <path d="M41 8a10 10 0 0 0-9.2 5.8 9.2 9.2 0 0 0 2.1 10.4c2.9 2.7 7.2 3.5 11 2a9.2 9.2 0 0 0 3.3-15.5A10.2 10.2 0 0 0 40.9 8z"/>
                        <path fill-rule="nonzero" d="M24.5 51c.4-1.5 1-3.8 2-6.8 0 0 .3-1.6 1.6-1.3 1.2.4.7 2.2.7 2.2L27.2 51m24.5 0l-1.3-4.8L50 44c.2-.7.5-1 .9-1.1 8.5-2 10.5-5 11.7-11.4L67 3.9C67 1.7 65.3 0 63.2 0c-2 .1-3.7 1.8-3.9 3.9L55 27.5c-.6 1.6-1 2.1-2.7 2.1h-23c-6.2 0-9.1 7.8-9.1 7.8L16 50.9M66.3 53H0v6.8h5.4V138h65V59.8H76V53h-9.7zm-4.6 38.2l-10.3 1c-.1-1.1-.4-2.2-.9-3.3l9.3-4.6c1 2.2 1.6 4.5 2 7zM59.1 83l-9.2 4.5c-.6-1-1.3-1.9-2.1-2.7l7-7.6c1.7 1.7 3.2 3.7 4.3 5.8zm-5.4-6.7l-7 7.6c-.9-.8-1.9-1.4-3-1.9l3.8-9.7c2.2 1 4.3 2.3 6.2 4zM39 70.5c2.4.1 4.7.6 7 1.4l-3.7 9.7c-1-.4-2.2-.6-3.3-.7V70.5zm-1.5 0V81c-1.2 0-2.3.2-3.4.6l-3.7-9.7c2.3-.8 4.7-1.2 7.1-1.3zM29 72.4l3.7 9.7c-1 .4-2 1-2.9 1.7L23 76c1.8-1.6 3.9-2.8 6-3.7zM21.9 77l7 7.6c-.9.8-1.6 1.8-2.2 2.8L17.5 83c1.1-2.2 2.6-4.1 4.4-5.8zm-5.1 7l9.2 4.7c-.5 1-.8 2.1-1 3.3l-10.3-1a23 23 0 0 1 2-7zm-2.3 10v-1.5l10.3 1v.6c0 1 .1 1.9.3 2.8l-10 2.9a24 24 0 0 1-.5-5.7zm1.3 7.2l9.9-2.8c.4 1.1 1 2.2 1.6 3.1L19 108c-1.4-2-2.5-4.2-3.2-6.6zm4.2 7.8l8.2-6.3a14 14 0 0 0 2.6 2.4l-5.5 8.7c-2-1.3-3.9-3-5.4-4.8zm6.5 5.6L32 106c1 .6 2.2 1 3.3 1.3l-2 10c-2.3-.4-4.6-1.3-6.7-2.5zm11.7 3.1a23 23 0 0 1-3.5-.2l2-10.2h1.5l2-.1 1.9 10.1a23 23 0 0 1-3.9.4zm5.3-.6l-2-10.1c1.1-.3 2.2-.8 3.2-1.3l5.4 8.8c-2 1.2-4.2 2-6.6 2.6zm8-3.4L46 105a13 13 0 0 0 2.5-2.3l8.2 6.2a23.8 23.8 0 0 1-5.3 4.9zm6.1-6.2l-8.2-6.2c.6-1 1-2 1.4-3l10 2.9c-.7 2.2-1.8 4.4-3.1 6.3zm3.6-7.7l-10-2.9.3-2.8v-.5l10.3-1v1.5c0 1.9-.2 3.8-.6 5.7z"/>
                      </g>
                    </svg>
                    <p>Are courageous, action oriented and optimistic advocates for the Goals.</p>
                  </div>
                </div>
                <div class="Grid-cell Grid-cell--sm1of2 Grid-cell--md1of4">
                  <div style="max-width: 20em;margin-left: auto;margin-right: auto;">
                    <svg height="100" viewBox="0 0 132 135" style="width: auto;">
                      <g fill="none" fill-rule="evenodd">
                        <path fill="#c5192d" fill-rule="nonzero" d="M39.35 54.01h-8.82A5.1 5.1 0 0 0 26 59.1V69.7c.07.77.7 1.35 1.47 1.35.76 0 1.4-.58 1.46-1.35V60.6c0-.35.1-.8.7-.8.62 0 .54.45.55.73v27.34c0 1.17.95 2.13 2.11 2.13 1.17 0 2.11-.96 2.11-2.13V72.13a.58.58 0 0 1 .16-.46.57.57 0 0 1 .44-.17c.16-.01.32.05.44.17.11.12.16.3.14.46v15.74c.1 1.11 1.01 1.97 2.12 1.97 1.1 0 2.03-.86 2.12-1.97V60.53c0-.28.1-.74.53-.74.42 0 .7.46.7.81v9.11c0 .82.66 1.49 1.48 1.49.81 0 1.47-.67 1.47-1.49V59.1A5.1 5.1 0 0 0 39.35 54zm-11.68-7.29c.16-.36.53-.97 1.86-1.15.24-.03.47-.1.68-.23.22-.42.5-.8.82-1.14v-.25c0-.6-.69-1.34-2.02-.7-1.62.78-1.44 3.2-1.44 3.2.04.22.08.37.1.27zm12.55-1.15c1.32.18 1.7.8 1.84 1.15 0 .1.07 0 .1-.26 0 0 .18-2.43-1.44-3.21-1.33-.63-1.95.1-2.02.7v.3c.29.33.53.68.73 1.05.24.15.5.24.79.27zm-5.37 6.87c2.49 0 4.5-2.04 4.5-4.55a4.52 4.52 0 0 0-4.5-4.55 4.52 4.52 0 0 0-4.5 4.55 4.52 4.52 0 0 0 4.5 4.55zM14.76 53.09H5.33a5.36 5.36 0 0 0-4.69 5.27v11.03c0 .85.69 1.55 1.53 1.55.85 0 1.54-.7 1.54-1.55v-9.47c0-.37.09-.85.74-.85.44 0 .54.48.55.78v28.47a2.22 2.22 0 0 0 2.2 2.05c1.16 0 2.12-.9 2.21-2.05V71.89a.6.6 0 0 1 .63-.65.6.6 0 0 1 .63.65v16.43a2.2 2.2 0 0 0 2.2 2.21c1.21 0 2.2-1 2.2-2.21V59.85c0-.3.1-.78.56-.78.45 0 .74.48.74.85v9.47a1.54 1.54 0 0 0 3.07 0V58.36a5.36 5.36 0 0 0-4.68-5.27zm-1.72-6.72c-.37-.3-.7-.6-1.33-.29-.42.19-.58.32-1.08.56-.9.41-1.85.7-2.82.85-.73.13-1.48.18-2.22.16a4.5 4.5 0 0 0 4.4 4.07 4.49 4.49 0 0 0 4.5-3.98c-.74-.72-.61-.65-1.45-1.37z"/>
                        <path fill="#c5192d" fill-rule="nonzero" d="M5.61 46.71a10.03 10.03 0 0 0 4.59-1.02c.46-.22.92-.41 1.4-.58.29-.14.61-.2.93-.14.15.06.29.15.4.26l.35.3s.17.16 1.21.97c.12.09.23.18.31.16.08-.03.13-.78.1-1.18a6.81 6.81 0 0 0-1.34-3.1.97.97 0 0 0-.96-.43c-.6.1-.59-.31-1-.55a3.98 3.98 0 0 0-3.9.63 10.18 10.18 0 0 0-2.93 4.02c-.17.37.27.66.84.66zM109.75 113.23l-5.15-3.9a1.07 1.07 0 0 0-1.58.14c-15.53 19.38-42.97 22.12-62.93 7.06-.6-.45-1.16-.93-1.81-1.4l5.63-3.72c.56-.38-.24-.83-.24-.83l-19.85-9.27c-.62-.3-.7 0-.7.33v.16l.54 22.16c0 .21.2.75.65.45l6.31-4.17a61.46 61.46 0 0 0 4.05 3.37c23.72 17.88 56.52 14.45 75.03-8.47l.2-.25a1.12 1.12 0 0 0-.15-1.66zM21.46 23.07l5.26 3.72a1.07 1.07 0 0 0 1.58-.18C43.22 6.74 70.58 3.22 90.97 17.58c.62.43 1.2.9 1.82 1.37l-5.45 3.88c-.56.4.28.82.28.82l20.1 8.74c.64.3.7 0 .7-.35v-.16l-1.19-22.16c0-.21-.22-.74-.67-.41l-6.19 4.37a52.98 52.98 0 0 0-4.13-3.27C71.99-6.74 39.3-2.37 21.5 21.14l-.19.25a1.12 1.12 0 0 0 .15 1.68zM106 40.57c-14.36 0-26 11.58-26 25.87a25.94 25.94 0 0 0 26 25.88c14.36 0 26-11.59 26-25.88a25.98 25.98 0 0 0-26-25.87zm13.12 45.46l-.84.51a23.52 23.52 0 0 1-18.72 2.38.95.95 0 0 1-.3-1.13 5.23 5.23 0 0 1 4.63-2.82c3.83-.36 8.88 2.5 9.67 2.02.8-.47 2.42-2.56 4.8-2.47a3.5 3.5 0 0 1 2.1.52c-.35.27-.69.54-1.05.8l-.3.2zm-15.88-42.97h.58a23.69 23.69 0 0 1 25.24 18.44l-.09.46a1.54 1.54 0 0 1-2.78.2c-.21-.34-1.25-1.3-1.21.35.03 1.64 1.6 1.8 0 2.78-.74.51-1.6.84-2.49.97a3.23 3.23 0 0 0-1.21 2.82c.18.9 2.34 3.36.74 3.25a9.06 9.06 0 0 1-3.63-3.18c-.5-1.3-1.03-2.56-1.41-3.61a1.4 1.4 0 0 0-2.24-.65c-.83.58.26 1.14-.36 2.37-.62 1.22-1.03 2.3-1.92 1.3-2.3-2.64-5.65-1.34-6.17-4.27-.3-1.57-1.67-1.42-2.81-2.33-1.15-.9-1.82-1.37-1.98-.72-.17.65 3.63 3.61 3.86 4.3.42 1.14-1.12 2.15-2.25 2.42-1.12.27-1.61-.63-2.7-1.8-1.09-1.18-1.58-1.96-1.67-1.07.09 1.56.9 3 2.18 3.9.96.61 2.01.88 1.81 1.8-.2.93 0 .42-1.09 1.49a2.87 2.87 0 0 0-1.2 2.85c0 1.48-.3 1.55-.54 2.78-.23 1.23-.76.16-1.21 1.95a6.69 6.69 0 0 1-1.46 3.01 4.79 4.79 0 0 1-3.2 1.21c-1.1 0-1.24-2.9-1.24-4.38 0-.5-.73.99-1.09-2.06-.24-1.95-1.5.2-1.6-1.1-.09-1.3-.72-1.03-1.38-1.8-.65-.79-1.48.08-2.4.48-.93.4-.54.63-1.82.22h-.1c-1.2-2.9-1.82-6-1.8-9.14 0-.8 0-3.61 1.28-4.53.5-.26 1.07-.34 1.63-.26 1.32.21 2.62.53 3.89.96 1.36.52 3.52 1.68 4.77 1.16.89-.37 1.61-.85 1.52-1.61-.09-.76-.85-1.18-1.81-.53-.35.22-1.06-1.42-1.62-1.33-.56.09.71 1.93.22 2-.49.08-1.42-1.93-1.58-2.25-.16-.33-.9-1.14-1.56-.53-1.4 1.32-3.43.81-4.2 1.1-1.6.64-1.66.2-1.64-.63a.97.97 0 0 1 .2-.63 2.86 2.86 0 0 1 2.61-.29c.62.4 1.05-.1 1.29-.36.23-.25.16-.61 0-.96-.16-.34.33-.56.63-.63.63-.31 1.24-.67 1.82-1.06a5.8 5.8 0 0 1 3.63 0c.8.45 1.8.24 2.36-.5a6.22 6.22 0 0 1 1.72-1.4c.34-.16-.85-1.27-1.81 0-.97 1.26-1.47 1.3-1.93 1.3-.45 0-3.2-.67-3.52-1.54-.32-.86.85-1.5 1.82-1.98 1.46-.35 2.96-.56 4.46-.63 1.43-.31 3.27-1.02 4.2-.4.92.61-3.85 1.7-2.3 2.53.57.3 3.09-1.45 3.94-1.8 2.04-1.04-1.97-1.38-1.45-3.51.53-2.13-4.9-1.46-7.64-1.25 2.6-1.66 5.52-2.8 8.57-3.34l1.14-.34zm18.87 39.72c-1.29-.65-1.14.4-1.81.17-.67-.24.72-1.7-1.18-.45-1.9 1.24-1.4-.2-2.22-2.3a4.24 4.24 0 0 1 2.45-5c1.39-.5 2.82-.9 4.27-1.17 2.83-.7 3.43-2.39 3.95-1.36l.27.54c.2.38.3.8.33 1.21a23.68 23.68 0 0 1-5.44 8.6 3.64 3.64 0 0 1-.62-.27v.03zm.94-12.82c-.27 0-.49-.34-.69-.9a.54.54 0 0 1 .14-.63.55.55 0 0 1 .65-.06c.53.3.93.78 1.1 1.36 0 .34-.94.3-1.2.2v.03zm2.53 2.19c-.73.36-1.6.29-2.25-.2-.6-.47.38-1.23.72-1.26.8-.11 2 .99 1.53 1.42v.04zm2.56-7.22c.34-.4-.71-1.56-.42-1.58.78-.05 1.52.4 1.81 1.12v1.95c0 1.57-.16 3.13-.47 4.66-.67-.5-2.9-3.88-.92-6.14v-.01zm-15.52 4.94c-.72.38-1.6.3-2.25-.2-.6-.46.38-1.22.73-1.26.8-.04 2 1.05 1.52 1.48v-.02zm-9.65 4.66c-.31.53-1.2 4.5-1.82 4.03-.61-.47.26-4.59.42-4.9.94-1.7 2.96-1.6 1.4.89v-.02zM86.15 53.98a3.2 3.2 0 0 1 1.81-.68c.6 0 1.38.2 1.47.6.1.39-1.47 1.1-1.81 1.35-.82.74-2.09 2.27-2.85 2.43-.2.08-.4.08-.6 0 .5-1.22 1.1-2.39 1.81-3.5l.17-.2zm3.63-4.6c.36 0 .83.12.9.4.02.51-.1 1.03-.32 1.5a4.02 4.02 0 0 1-2.5 1.11.76.76 0 0 1-.6-.36c.73-.93 1.52-1.8 2.37-2.63l.15-.02z"/>
                      </g>
                    </svg>
                    <p>Have a compelling story that will engage a wider audience and global media.</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="u-textCenter" style="margin-top: 0;">
              <a href="/campaign" class="Button Button--lg u-inlineBlock">Begin voting</a>
            </div>
            <div class="Text Text--center" style="margin-bottom: 6rem">
              <br>
              <a href="https://prismic-io.s3.amazonaws.com/globalgoals/85b9d23c-8603-40a4-8063-b550ddc936d5_2021-goalkeepers-awards-terms.pdf" target="_blank">Read the terms and conditions</a>
            </div>
          </div>
        </section>
      </main>
    `
  }
}
