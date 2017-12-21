const html = require('choo/html')
const asElement = require('prismic-element')
const { asText } = require('prismic-richtext')
const { href } = require('../../params')

module.exports = function tips (state, doc) {
  return html`
    <ul class="Grid">
      ${doc.data.tips.map((tip, index) => html`
        <div class="Grid-cell Grid-cell--md1of2" id="${doc.id}-tip-${index}">
          <div class="Engager-tip">
            <svg viewBox="0 0 64 64" width="64" height="64" class="Engager-tipIcon">
              <g fill="none" fill-rule="evenodd">
                <circle fill="#E5243B" cx="32" cy="32" r="32"/>
                <g fill="#FFF">
                  <path d="M31.75 41.16h-4.3v-1c-.03-2.32-.62-3.68-2.3-6.08l-.27-.4c-1.7-2.44-2.38-3.98-2.38-6.43 0-5.1 4.14-9.25 9.25-9.25 5.12 0 9.28 4.15 9.25 9.26-.02 2.5-.68 4-2.4 6.42-.04.08-.12.2-.26.4-1.66 2.32-2.25 3.7-2.3 6.1v.98h-4.3zm0-2h2.35c.2-2.33.96-3.93 2.6-6.25l.28-.35c1.5-2.1 2-3.3 2.02-5.3.03-3.98-3.24-7.23-7.25-7.23-4 0-7.25 3.26-7.25 7.26 0 1.95.52 3.15 2.02 5.3l.27.4c1.63 2.35 2.4 3.95 2.6 6.2h2.33z" fill-rule="nonzero"/>
                  <path d="M27.43 42.57h8.68v1.14h-8.65zm1.7 2.3h5.3V46h-5.3"/>
                </g>
              </g>
            </svg>
            <div class="Engager-tipText">
              <div class="Text">
                ${tip.title ? html`<strong>${asText(tip.title)}</strong>` : null}
                ${asElement(tip.text, href)}
              </div>
            </div>
          </div>
        </div>
      `)}
    </ul>
  `
}
