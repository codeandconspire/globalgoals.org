const html = require('choo/html')
const links = require('../header/links')
const glyph = require('../glyph')
const { __ } = require('../../locale')

module.exports = function footer (state) {
  return html`
    <footer class="Footer">
      <nav class="View-section">
        <div class="Footer-content">
          <div class="Footer-column Footer-column--horizontal">
            <h2 class="Footer-title">${__('On Social Media Platforms')}</h2>
            <ul class="Footer-list Footer-list--social">
              ${links.social.map(item => item(state)).map(item => html`
                <li class="Footer-item">
                  <a class="Footer-link" href="${item.href}">
                    <span class="u-hiddenVisually">${item.title}</span>
                    <div class="Footer-social Footer-social--${item.name}">
                      ${glyph[item.name]('Footer-socialIcon')}
                    </div>
                  </a>
                </li>
              `)}
            </ul>
            <h2 class="Footer-title">${__('Content Information')}</h2>
            <ul class="Footer-list">
              ${links.info.map(item => item(state)).map(item => html`
                <li class="Footer-item"><a class="Footer-link" href="https://www.globalgoals.org${item.href}">${__(item.title)}</a></li>
              `)}
            </ul>
          </div>
        </div>
      </nav>
    </footer>
  `
}
