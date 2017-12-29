const html = require('choo/html')
const view = require('../components/view')
const intro = require('../components/intro')
const { __, languages } = require('../locale')

module.exports = view('lang', lang, title)

function lang (state, emit) {
  return html`
    <main class="View-main" id="view-main">
      <div class="View-section">
        ${intro({ pageIntro: true, title: __('Languages') })}
        <div class="Text Text--full">
          <ul class="Text-cols">
            ${Object.keys(languages).map(key => html`
              <li>
                <a href="/${key === 'en' ? '' : key}" onclick=${onclick}>${languages[key][key]}</a>
              </li>
            `)}
          </ul>
        </div>
      </div>
    </main>
  `
}

function onclick (event) {
  window.location.assign(event.target.href)
  event.preventDefault()
}

function title () {
  return __('Languages')
}
