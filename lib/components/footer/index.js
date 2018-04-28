const html = require('choo/html')
const logo = require('../logo')
const links = require('../header/links')
const glyph = require('../glyph')
const { __ } = require('../../locale')

module.exports = function footer (state) {
  return html`
    <footer class="Footer">
      <nav class="View-section">
        <div class="Footer-content">
          <div class="Footer-column Footer-column--logo">
            <div class="Footer-logo">
              ${logo.vertical()}
            </div>
          </div>
          <div class="Footer-column">
            <h2 class="Footer-title">${__('Shortcuts')}</h2>
            <ul class="Footer-list">
              ${links.secondary.map(item => item(state)).map(item => {
                let href = item.href
                if (/^\//.test(item.href)) href = process.env.GLOBALGOALS_URL + href
                return html`
                  <li class="Footer-item"><a class="Footer-link" href="${href}">${__(item.title)}</a></li>
                `
              })}
            </ul>
          </div>
          <div class="Footer-column Footer-column--sponsors">
            <h2 class="Footer-title">${__('Partners')}</h2>
            <ul class="Footer-list">
              ${links.partners.map(item => item(state)).map(item => {
                let href = item.href
                if (/^\//.test(item.href)) href = process.env.GLOBALGOALS_URL + href
                return html`
                  <li class="Footer-item"><a class="Footer-link" href="${href}">${__(item.title)}</a></li>
                `
              })}
            </ul>
          </div>
          <div class="Footer-column Footer-column--credits">
            <h2 class="Footer-title">${__('Credits')}</h2>
            <ul class="Footer-list">
              ${links.credits.map(item => item(state)).map(item => html`
                <li class="Footer-item">
                  ${item.href ? html`
                    <a class="Footer-blockLink" href="${item.href}">
                      <div class="Footer-figure">
                        <img class="Footer-figureImg" alt="${item.title}" height="${item.image.height}" src="${item.image.src}">
                      </div>
                      <div class="Footer-blockLinkTarget">${item.role}<em class="Footer-name">${item.title}</em></div>
                    </a>
                  ` : html`
                    <div class="Footer-blockLinkTarget">${item.role}<em class="Footer-name">${item.title}</em></div>
                  `}
                </li>
              `)}
            </ul>
          </div>
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
              ${links.info.map(item => item(state)).map(item => {
                let href = item.href
                if (/^\//.test(item.href)) href = process.env.GLOBALGOALS_URL + href
                return html`
                  <li class="Footer-item"><a class="Footer-link" href="${href}">${__(item.title)}</a></li>
                `
              })}
            </ul>
          </div>
        </div>
      </nav>
    </footer>
  `
}
