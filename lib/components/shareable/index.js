const html = require('choo/html')
const { __ } = require('../../locale')
const { className } = require('../base/utils')
const glyph = require('../glyph')

module.exports = function shareable (opts) {
  const defaultText = opts.email ? __('Email to a friend') : __('Share with others')
  const classList = className('Shareable', {
    'Shareable--large': opts.large,
    'Shareable--muted': opts.email
  })

  function wrap (content) {
    if (opts.href) {
      return html`
        <div class="${classList}">
          <a class="Shareable-action" href="${opts.href}" onclick=${opts.onclick ? opts.onclick : null}>
            ${content}
          </a>
        </div>
      `
    } else {
      return html`
        <div class="${classList}">
          <button class="Shareable-action" onclick=${opts.onclick} type="button">
            ${content}
          </button>
        </div>
      `
    }
  }

  return wrap(html`
    <div class="Shareable-content">
      <div class="Shareable-text">
        ${opts.email ? html`
          <svg class="Shareable-icon" viewBox="0 0 48 49" width="48" height="48">
            <g fill="none" fill-rule="evenodd">
              <circle fill="currentColor" cx="24" cy="24" r="24"/>
              <path stroke-width="1.3" d="M14 17.5c-.3 0-.5.2-.5.5v12.5c0 .3.2.5.5.5h20c.3 0 .5-.2.5-.5V18c0-.3-.2-.5-.5-.5H14z" stroke="#fff"/>
              <path stroke-width="1.3" d="M24 26.5l9.7-8.5M27 24l6.6 6.7m-13-6.7L14 30.7m10-4.3L14 18" stroke="#fff" stroke-linecap="square"/>
            </g>
          </svg>
        ` : html`
          <svg class="Shareable-icon" viewBox="0 0 32 32" width="32" height="32">
            <g fill="none" fill-rule="evenodd">
              <circle fill="currentColor" cx="16" cy="16" r="16"/>
              <path stroke="#fff" d="M18.14 14H21v8H11v-8h2.856M16 8v10"/>
              <path class="Shareable-arrow" d="M15.933 8L13 11m3-3l2.933 3" stroke="#fff" stroke-linecap="square"/>
            </g>
          </svg>
        `}
        ${opts.text ? opts.text : defaultText}
      </div>

      ${opts.examples ? html`
        <div class="Shareable-examples">
          ${glyph.mail('Shareable-example')}
          ${glyph.facebook('Shareable-example')}
          ${glyph.vk('Shareable-example')}
          ${glyph.weibo('Shareable-example')}
          ${glyph.twitter('Shareable-example')}
        </div>`
      : null}
    </div>
  `)
}
