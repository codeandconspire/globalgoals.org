const html = require('choo/html')
const view = require('../components/view')
const { __, languages } = require('../locale')

module.exports = view('lang', lang, title)

function lang (state, emit) {
  return html`
    <main class="View-main u-transformTarget" id="view-main">
      <div class="View-section">
        <div class="Space Space--textBlock Space--textBlockFirst">
          <ul class="Whopper">
            ${Object.keys(languages).map(key => html`
              <li class="Whopper-item">
                <a class="Whopper-link " href="/${key === 'en' ? '' : key}" onclick=${onclick}>
                  <span class="Whopper-text ${sizeClass(key)}">
                    ${languages[key][key]}
                    <div class="Whopper-arrow"></div>
                  </span>
                </a>
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

function sizeClass (lang) {
  const sizeTweaked = (lang === 'ja') || (lang === 'ch')
  return sizeTweaked ? 'Whopper-text--nonRoman' : ''
}

function title () {
  return __('Languages')
}
