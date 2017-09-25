const url = require('url');
const html = require('choo/html');
const component = require('fun-component');
const { title, description, image } = require('../meta');
const { __ } = require('../../locale');

const MAX_SIZE = 40;
const ROOT = process.env.GLOBALGOALS_URL;
const URL_ID = `input-${ (new Date() % 9e6).toString(36) }`;
const HAS_WINDOW = typeof window !== 'undefined';
const CAN_COPY = HAS_WINDOW && 'execCommand' in document;

module.exports = component({
  name: 'share',
  load() {
    window.addEventListener('scroll', onscroll);
    this.unload = () =>  window.removeEventListener('scroll', onscroll);
    function onscroll(event) {
      event.preventDefault();
    }
  },
  render(state, emit) {
    const href = url.resolve(ROOT, state.href).replace(/\/$/, '');

    return html`
      <div class="Share" id="share">
        <div class="Share-container">
          <a href="/${ state.href }" class="Share-close" onclick=${ close }>
            <span class="u-hiddenVisually">${ __('Close') }</span>
          </a>
          <div class="Share-body">
            <h2 class="Share-heading">${ __('Choose how to share') }</h2>
            <ul class="Share-options">
              <li class="Share-option">
                <a href="wechat" class="Share-link">
                  <svg viewBox="0 0 64 64" width="64" height="64" class="Share-icon">
                    <g fill="none" fill-rule="evenodd">
                      <circle fill="#20C300" cx="32" cy="32" r="32"/>
                      <g fill-rule="nonzero" fill="#FFF">
                        <path d="M38.7 26.15c.44 0 .87.03 1.3.08-1.16-5.3-6.95-9.23-13.56-9.23C19.04 17 13 21.92 13 28.18c0 3.6 2 6.57 5.38 8.87L17.03 41l4.7-2.3c1.7.32 3.03.65 4.7.65.43 0 .85-.02 1.26-.05-.3-.88-.46-1.8-.46-2.76 0-5.73 5.04-10.4 11.42-10.4zm-7.22-3.56c1 0 1.68.6 1.68 1.6s-.67 1.63-1.68 1.63c-1 0-2.02-.66-2.02-1.64 0-1 1-1.64 2.02-1.64zm-9.4 3.23c-1 0-2.03-.66-2.03-1.64 0-1 1.02-1.64 2.02-1.64s1.68.64 1.68 1.63c0 1-.67 1.64-1.68 1.64z"/>
                        <path d="M51 36.82c0-5.4-5.4-9.82-11.5-9.82-6.43 0-11.5 4.4-11.5 9.82s5.07 9.82 11.5 9.82c1.35 0 2.7-.34 4.07-.68l3.7 2.04-1-3.38c2.7-2.05 4.73-4.75 4.73-7.8zm-15.22-1.7c-.67 0-1.36-.67-1.36-1.35s.7-1.36 1.36-1.36c1.02 0 1.7.7 1.7 1.4s-.68 1.36-1.7 1.36zm7.44 0c-.67 0-1.35-.67-1.35-1.35s.67-1.36 1.35-1.36c1 0 1.7.7 1.7 1.4s-.7 1.36-1.7 1.36z"/>
                      </g>
                    </g>
                  </svg>
                  WeChat
                </a>
              </li>
              <li class="Share-option">
                <a href="facebook" class="Share-link">
                  <svg viewBox="0 0 64 64" width="64" height="64" class="Share-icon">
                    <g fill="none" fill-rule="evenodd">
                      <circle fill="#3C5A99" cx="32" cy="32" r="32"/>
                      <path d="M44.45 46c.86 0 1.55-.7 1.55-1.55v-24.9c0-.86-.7-1.55-1.55-1.55h-24.9c-.86 0-1.55.7-1.55 1.55v24.9c0 .86.7 1.55 1.55 1.55h24.9z" fill="#FFF"/>
                      <path d="M37.3 46V35.2h3.65l.54-4.22h-4.2V28.3c0-1.22.34-2.05 2.1-2.05h2.23v-3.77c-.38-.05-1.7-.16-3.26-.16-3.22 0-5.43 1.96-5.43 5.56v3.1H29.3v4.2h3.65V46h4.36z" fill="#3C5A99"/>
                    </g>
                  </svg>
                  Facebook
                </a>
              </li>
              <li class="Share-option">
                <a href="twitter" class="Share-link">
                  <svg viewBox="0 0 64 64" width="64" height="64" class="Share-icon">
                    <g fill="none" fill-rule="evenodd">
                      <circle fill="#1DA1F2" cx="32" cy="32" r="32"/>
                      <path d="M28.18 44c9.8 0 15.17-8.46 15.17-15.8v-.72c1.03-.78 1.94-1.76 2.65-2.88-.96.45-1.98.74-3.06.88 1.1-.7 1.94-1.78 2.34-3.07-1.03.67-2.17 1.1-3.38 1.38-.98-1.1-2.36-1.77-3.9-1.77-2.94 0-5.33 2.5-5.33 5.56 0 .44.04.86.13 1.27-4.43-.23-8.36-2.44-11-5.8-.45.82-.7 1.77-.7 2.8 0 1.92.93 3.62 2.36 4.6-.87-.02-1.7-.27-2.42-.68v.07c0 2.7 1.84 4.96 4.28 5.47-.44.12-.92.2-1.4.2-.35 0-.68-.05-1-.1.67 2.2 2.64 3.8 4.98 3.84-1.83 1.5-4.13 2.4-6.63 2.4-.43 0-.85-.03-1.27-.08 2.36 1.58 5.16 2.5 8.18 2.5" fill="#FFF"/>
                    </g>
                  </svg>
                  Twitter
                </a>
              </li>
              <li class="Share-option">
                <a href="Google+" class="Share-link">
                  <svg viewBox="0 0 64 64" width="64" height="64" class="Share-icon">
                    <g fill="none" fill-rule="evenodd">
                      <circle fill="#DD4330" cx="32" cy="32" r="32"/>
                      <path d="M26.85 29.9v3.92h5.32c-.84 2.52-2.13 3.9-5.32 3.9-3.23 0-5.76-2.62-5.76-5.86 0-3.23 2.5-5.86 5.73-5.86 1.7 0 2.8.6 3.82 1.44.8-.8.74-.92 2.8-2.87-1.75-1.6-4.05-2.57-6.6-2.57C21.4 22 17 26.42 17 31.86c0 5.45 4.4 9.87 9.85 9.87 8.12 0 10.1-7.1 9.45-11.82h-9.45zm17.74.2v-3.4h-2.47v3.4h-3.5v2.45h3.5v3.5h2.44v-3.5H48V30.1h-3.4z" fill="#FFF"/>
                    </g>
                  </svg>
                  Google +
                </a>
              </li>
              <li class="Share-option">
                <a href="vk" class="Share-link">
                  <svg viewBox="0 0 64 64" width="64" height="64" class="Share-icon">
                    <g fill="none" fill-rule="evenodd">
                      <circle fill="#4A74A5" cx="32" cy="32" r="32"/>
                      <path d="M47.8 39.3V39c-.6-1-1.6-2-3.2-3.6L43.3 34c-.4-.4-.4-1-.3-1.3l1.5-2.2 1-1.4c2-2.4 2.7-4 2.5-4.7V24h-.6c-.3-.2-.7-.2-1-.2h-4.7-.6v.2l-.2.2v.3c-.6 1.3-1.2 2.5-2 3.7L38 30l-.8 1-.6.6-.4.2h-.3l-.4-.5c0-.2 0-.4-.2-.6V30v-.8-.7-1.3l.2-1.2v-1-.6l-.2-.6-.4-.4s-.3 0-.5-.2l-2-.2c-2 0-3.4 0-4 .4-.2 0-.4.3-.6.5-.2 0-.2.3 0 .3.6 0 1 .3 1.3.7v.2c.2 0 .3.4.4.7l.2 1v2.2c0 .6 0 1-.2 1.3 0 .3 0 .6-.2.8 0 .2 0 .3-.2.4H28h-.4L27 31l-1-1.2-.8-1.7-.2-.3-.7-1.4-.7-1.7c0-.2-.3-.4-.4-.5h-.4c0-.2-.2-.2-.3-.2H18c-.4 0-.7 0-1 .3v.9l2.2 4.4 2 3.5c.5.7 1 1.6 1.7 2.4.5.7 1 1.2 1 1.4l.5.5.4.4 1 1 1.7 1 2 1c1 .2 1.7.2 2.5.2H34c.4 0 .7-.2 1-.5v-.3-.5c0-.5 0-1 .2-1.3 0-.3.2-.6.3-.8 0-.2.2-.4.4-.5l.3-.2c.2 0 .5 0 1 .3l1 1 1 1.3 1 1 .4.2.8.4h5c.5 0 .8-.2 1-.3.3 0 .4-.3.4-.5v-.5c0-.2 0-.4-.2-.4z" fill="#FFF" fill-rule="nonzero"/>
                    </g>
                  </svg>
                  VK
                </a>
              </li>
              <li class="Share-option">
                <a href="other" class="Share-link">
                  <svg viewBox="0 0 64 64" width="64" height="64" class="Share-icon">
                    <g fill="none" fill-rule="evenodd">
                      <circle fill="#B5BFC5" cx="32" cy="32" r="32"/>
                      <g transform="translate(21 30)" fill="#FFF">
                        <circle cx="2" cy="2" r="2"/>
                        <circle cx="11" cy="2" r="2"/>
                        <circle cx="20" cy="2" r="2"/>
                      </g>
                    </g>
                  </svg>
                  ${ __('More') }
                </a>
              </li>
            </ul>
            <div class="Share-raw">
              <input onclick=${ select } class="Share-url" id="${ URL_ID }" type="text" readonly size="${ Math.min(href.length, MAX_SIZE) }" value="${ href }" />
              <span class="Share-fade"></span>
              ${ CAN_COPY ? html`
                <button class="Share-button" onclick=${ copy }>${ __('Copy link') }</button>
              ` : null }
            </div>
          </div>
          <div class="Share-preview">
            <img class="Share-thumbnail" src="${ image(state) }" width="64" height="64" />
            <div class="Share-meta">
              <h2 class="Share-title">${ title(state) }</h2>
              <p class="Share-description">${ description(state) }</p>
            </div>
          </div>
        </div>
      </div>
    `;

    function close(event) {
      emit('ui:share:close');
      event.preventDefault();
    }

    function select(event) {
      event.target.select();
    }

    function copy() {
      const input = document.getElementById(URL_ID);
      input.select();
      document.execCommand('Copy');
    }
  }
});
