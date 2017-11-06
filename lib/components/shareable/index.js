const html = require('choo/html')
const { __ } = require('../../locale')
const { className } = require('../base/utils')

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
          <svg viewBox="0 0 64 64" width="64" height="64" class="Shareable-example" role="presentation" aria-hidden="true">
            <g fill="none" fill-rule="evenodd">
              <path stroke-width="1" stroke="currentColor" d="M15 20v25h34V20H15zm17 15.7L17.6 21.5h29L32 35.7zm-6.3-4.2l-9.2 10.7V22.5l9.2 9zm1 1L32 38l5.3-5.2 9.4 11H17.4l9.3-11zm11.7-1l9.2-9v19.7l-9.2-10.7z" fill="currentColor" fill-rule="nonzero"/>
            </g>
          </svg>
          <svg viewBox="0 0 64 64" width="64" height="64" class="Shareable-example" role="presentation" aria-hidden="true">
            <g fill="none" fill-rule="evenodd">
              <path d="M44.45 46c.86 0 1.55-.7 1.55-1.55v-24.9c0-.86-.7-1.55-1.55-1.55h-24.9c-.86 0-1.55.7-1.55 1.55v24.9c0 .86.7 1.55 1.55 1.55h24.9z" fill="currentColor"/>
              <path d="M37.3 46V35.2h3.65l.54-4.22h-4.2V28.3c0-1.22.34-2.05 2.1-2.05h2.23v-3.77c-.38-.05-1.7-.16-3.26-.16-3.22 0-5.43 1.96-5.43 5.56v3.1H29.3v4.2h3.65V46h4.36z" fill="#fff"/>
            </g>
          </svg>
          <svg viewBox="0 0 64 64" width="64" height="64" class="Shareable-example" role="presentation" aria-hidden="true">
            <g fill="none" fill-rule="evenodd">
              <path d="M47.8 39.3V39c-.6-1-1.6-2-3.2-3.6L43.3 34c-.4-.4-.4-1-.3-1.3l1.5-2.2 1-1.4c2-2.4 2.7-4 2.5-4.7V24h-.6c-.3-.2-.7-.2-1-.2h-4.7-.6v.2l-.2.2v.3c-.6 1.3-1.2 2.5-2 3.7L38 30l-.8 1-.6.6-.4.2h-.3l-.4-.5c0-.2 0-.4-.2-.6V30v-.8-.7-1.3l.2-1.2v-1-.6l-.2-.6-.4-.4s-.3 0-.5-.2l-2-.2c-2 0-3.4 0-4 .4-.2 0-.4.3-.6.5-.2 0-.2.3 0 .3.6 0 1 .3 1.3.7v.2c.2 0 .3.4.4.7l.2 1v2.2c0 .6 0 1-.2 1.3 0 .3 0 .6-.2.8 0 .2 0 .3-.2.4H28h-.4L27 31l-1-1.2-.8-1.7-.2-.3-.7-1.4-.7-1.7c0-.2-.3-.4-.4-.5h-.4c0-.2-.2-.2-.3-.2H18c-.4 0-.7 0-1 .3v.9l2.2 4.4 2 3.5c.5.7 1 1.6 1.7 2.4.5.7 1 1.2 1 1.4l.5.5.4.4 1 1 1.7 1 2 1c1 .2 1.7.2 2.5.2H34c.4 0 .7-.2 1-.5v-.3-.5c0-.5 0-1 .2-1.3 0-.3.2-.6.3-.8 0-.2.2-.4.4-.5l.3-.2c.2 0 .5 0 1 .3l1 1 1 1.3 1 1 .4.2.8.4h5c.5 0 .8-.2 1-.3.3 0 .4-.3.4-.5v-.5c0-.2 0-.4-.2-.4z" fill="currentColor" fill-rule="nonzero"/>
            </g>
          </svg>
          <svg viewBox="0 0 64 64" width="64" height="64" class="Shareable-example" role="presentation" aria-hidden="true">
            <g fill="none" fill-rule="evenodd">
              <path d="M40.5 31.6c-1.3-.2-.7-1-.7-1s1.4-2.2-.2-3.8c-2-2-6.7.3-6.7.3-2 .7-1.4-.2-1.2-1.6 0-1.7-.5-4.5-5.4-2.8-4.8 1.7-9 7.5-9 7.5-2.8 4-2.4 7-2.4 7 .7 6.7 7.7 8.5 13 9 5.8.4 13.4-2 15.8-7 2.3-5-2-7-3.3-7.4zM28.5 44c-5.6.3-10.2-2.5-10.2-6.4 0-3.8 4.6-7 10.2-7 5.7-.4 10.2 2 10.2 5.8s-4.5 7.4-10.2 7.7zm-1-11c-5.8.7-5 6-5 6s-.2 1.8 1.4 2.6c3.2 2 6.6.8 8.4-1.5 1.7-2.2.7-7.7-5-7zm-1.6 7.6c-1 0-2-.5-2-1.4 0-1 .8-2 2-2 1 0 2 .6 2 1.5 0 1-1 1.7-2 2zm3.3-3c-.4.3-.8.3-1 0-.2-.3 0-1 .2-1 .5-.4 1-.3 1 0 .3.3 0 .8-.2 1zm14-8.3c.4 0 .8-.4 1-.8C44.8 22 39 23 39 23c-.4 0-.8.4-.8 1 0 .4.4.8 1 .8 4-1 3.2 3.4 3.2 3.4 0 .5.4 1 1 1zm-.7-11c-2-.6-4 0-4.6 0h-.2c-.6.2-1 .7-1 1.4s.6 1.4 1.4 1.4c0 0 .7 0 1.2-.2S44 20.6 46 24c1.2 2.7.6 4.4.5 4.7l-.2 1.3c0 .8.6 1.3 1.3 1.3.6 0 1 0 1.3-1.2 2-7.4-2.8-11-6.4-11.8z" fill="currentColor" fill-rule="nonzero"/>
            </g>
          </svg>
          <svg viewBox="0 0 64 64" width="64" height="64" class="Shareable-example" role="presentation" aria-hidden="true">
            <g fill="none" fill-rule="evenodd">
              <path d="M28.18 44c9.8 0 15.17-8.46 15.17-15.8v-.72c1.03-.78 1.94-1.76 2.65-2.88-.96.45-1.98.74-3.06.88 1.1-.7 1.94-1.78 2.34-3.07-1.03.67-2.17 1.1-3.38 1.38-.98-1.1-2.36-1.77-3.9-1.77-2.94 0-5.33 2.5-5.33 5.56 0 .44.04.86.13 1.27-4.43-.23-8.36-2.44-11-5.8-.45.82-.7 1.77-.7 2.8 0 1.92.93 3.62 2.36 4.6-.87-.02-1.7-.27-2.42-.68v.07c0 2.7 1.84 4.96 4.28 5.47-.44.12-.92.2-1.4.2-.35 0-.68-.05-1-.1.67 2.2 2.64 3.8 4.98 3.84-1.83 1.5-4.13 2.4-6.63 2.4-.43 0-.85-.03-1.27-.08 2.36 1.58 5.16 2.5 8.18 2.5" fill="currentColor"/>
            </g>
          </svg>
        </div>`
      : null}
    </div>
  `)
}
