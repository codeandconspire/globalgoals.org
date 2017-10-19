const url = require('url');
const html = require('choo/html');
const component = require('fun-component');
const { __ } = require('../../locale');
const { inBrowser } = require('../base/utils');

const ROOT = process.env.GLOBALGOALS_URL;
const URL_ID = `input-${ (new Date() % 9e6).toString(36) }`;
const CAN_COPY = inBrowser && 'execCommand' in document;

module.exports = component({
  name: 'share',
  load(element) {
    const close = element.querySelector('.js-close');
    const onscroll = event => event.preventDefault();

    element.focus();

    /**
     * Create a tab black hole
     */

    element.addEventListener('keydown', event => {
      if (event.target === element && event.shiftKey && event.code === 'Tab') {
        event.preventDefault();
      }
    });
    close.addEventListener('keydown', event => {
      if (!event.shiftKey && event.code === 'Tab') {
        event.preventDefault();
      }
    });

    /**
     * Prevent scroll while share dialog is open
     */

    window.addEventListener('wheel', onscroll);
    window.addEventListener('touchmove', onscroll);
    document.documentElement.classList.add('has-overlay');

    this.unload = () => {
      window.removeEventListener('wheel', onscroll);
      window.removeEventListener('touchmove', onscroll);
      document.documentElement.classList.remove('has-overlay');
    };
  },
  render(props, emit) {
    const href = url.resolve(ROOT, props.href).replace(/\/$/, '');
    const uri = encodeURIComponent(href);

    return html`
      <div class="Share" id="share" tabindex="0">
        <div class="Share-container">
          <div class="Share-body">
            <h2 class="Share-heading">${ __('Choose how to share') }</h2>
            <ul class="Share-options">
              <li class="Share-option">
                <a target="_blank" rel="noopener noreferrer"  href="${ process.env.FACEBOOK_ID ? `https://www.facebook.com/dialog/share?app_id=${ process.env.FACEBOOK_ID }&display=page&href=${ uri }&redirect_uri=${ uri }` : `https://www.facebook.com/sharer.php?u=${ uri }` }" class="Share-link">
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
                <a target="_blank" rel="noopener noreferrer"  href="https://twitter.com/intent/tweet?url=${ uri }&text=${ encodeURIComponent(props.description) }&${ process.env.TWITTER_USERNAME ? `via=${ process.env.TWITTER_USERNAME }` : '' }" class="Share-link">
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
                <a target="_blank" rel="noopener noreferrer"  href="http://service.weibo.com/share/share.php?url=${ uri }&appkey=&title=${ encodeURIComponent(props.description) }&pic=&ralateUid=" class="Share-link">
                  <svg viewBox="0 0 64 64" width="64" height="64" class="Share-icon">
                    <g fill="none" fill-rule="evenodd">
                      <circle fill="#E1162C" cx="32" cy="32" r="32"/>
                      <path d="M40.5 31.6c-1.3-.2-.7-1-.7-1s1.4-2.2-.2-3.8c-2-2-6.7.3-6.7.3-2 .7-1.4-.2-1.2-1.6 0-1.7-.5-4.5-5.4-2.8-4.8 1.7-9 7.5-9 7.5-2.8 4-2.4 7-2.4 7 .7 6.7 7.7 8.5 13 9 5.8.4 13.4-2 15.8-7 2.3-5-2-7-3.3-7.4zM28.5 44c-5.6.3-10.2-2.5-10.2-6.4 0-3.8 4.6-7 10.2-7 5.7-.4 10.2 2 10.2 5.8s-4.5 7.4-10.2 7.7zm-1-11c-5.8.7-5 6-5 6s-.2 1.8 1.4 2.6c3.2 2 6.6.8 8.4-1.5 1.7-2.2.7-7.7-5-7zm-1.6 7.6c-1 0-2-.5-2-1.4 0-1 .8-2 2-2 1 0 2 .6 2 1.5 0 1-1 1.7-2 2zm3.3-3c-.4.3-.8.3-1 0-.2-.3 0-1 .2-1 .5-.4 1-.3 1 0 .3.3 0 .8-.2 1zm14-8.3c.4 0 .8-.4 1-.8C44.8 22 39 23 39 23c-.4 0-.8.4-.8 1 0 .4.4.8 1 .8 4-1 3.2 3.4 3.2 3.4 0 .5.4 1 1 1zm-.7-11c-2-.6-4 0-4.6 0h-.2c-.6.2-1 .7-1 1.4s.6 1.4 1.4 1.4c0 0 .7 0 1.2-.2S44 20.6 46 24c1.2 2.7.6 4.4.5 4.7l-.2 1.3c0 .8.6 1.3 1.3 1.3.6 0 1 0 1.3-1.2 2-7.4-2.8-11-6.4-11.8z" fill="#FFF" fill-rule="nonzero"/>
                    </g>
                  </svg>
                  Sina Weibo
                </a>
              </li>
              <li class="Share-option">
                <a target="_blank" rel="noopener noreferrer"  href="http://vk.com/share.php?url=${ uri }" class="Share-link">
                  <svg viewBox="0 0 64 64" width="64" height="64" class="Share-icon">
                    <g fill="none" fill-rule="evenodd">
                      <circle fill="#4A74A5" cx="32" cy="32" r="32"/>
                      <path d="M47.8 39.3V39c-.6-1-1.6-2-3.2-3.6L43.3 34c-.4-.4-.4-1-.3-1.3l1.5-2.2 1-1.4c2-2.4 2.7-4 2.5-4.7V24h-.6c-.3-.2-.7-.2-1-.2h-4.7-.6v.2l-.2.2v.3c-.6 1.3-1.2 2.5-2 3.7L38 30l-.8 1-.6.6-.4.2h-.3l-.4-.5c0-.2 0-.4-.2-.6V30v-.8-.7-1.3l.2-1.2v-1-.6l-.2-.6-.4-.4s-.3 0-.5-.2l-2-.2c-2 0-3.4 0-4 .4-.2 0-.4.3-.6.5-.2 0-.2.3 0 .3.6 0 1 .3 1.3.7v.2c.2 0 .3.4.4.7l.2 1v2.2c0 .6 0 1-.2 1.3 0 .3 0 .6-.2.8 0 .2 0 .3-.2.4H28h-.4L27 31l-1-1.2-.8-1.7-.2-.3-.7-1.4-.7-1.7c0-.2-.3-.4-.4-.5h-.4c0-.2-.2-.2-.3-.2H18c-.4 0-.7 0-1 .3v.9l2.2 4.4 2 3.5c.5.7 1 1.6 1.7 2.4.5.7 1 1.2 1 1.4l.5.5.4.4 1 1 1.7 1 2 1c1 .2 1.7.2 2.5.2H34c.4 0 .7-.2 1-.5v-.3-.5c0-.5 0-1 .2-1.3 0-.3.2-.6.3-.8 0-.2.2-.4.4-.5l.3-.2c.2 0 .5 0 1 .3l1 1 1 1.3 1 1 .4.2.8.4h5c.5 0 .8-.2 1-.3.3 0 .4-.3.4-.5v-.5c0-.2 0-.4-.2-.4z" fill="#FFF" fill-rule="nonzero"/>
                    </g>
                  </svg>
                  VK
                </a>
              </li>
              ${ props.asset ? html`
                <li class="Share-option">
                  <a target="_blank" rel="noopener noreferrer"  href="${ props.asset }" class="Share-link" download>
                    <svg viewBox="0 0 32 32" width="64" height="64" class="Share-icon">
                      <g fill="none" fill-rule="evenodd">
                        <circle fill="#10BDE4" cx="16" cy="16" r="16"/>
                        <path d="M11.38 22.13H21v1h-9.6zm4.37-4.36l-4.4-4.4-.63.64 5.47 5.5 5.44-5.5-.64-.62-4.4 4.4V9h-.86v8.77z" fill="#FFF"/>
                      </g>
                    </svg>
                    ${ __('Download') }
                  </a>
                </li>
              ` : null }
              <li class="Share-option">
                <a href="mailto:?subject=${ props.title }&body=${ props.description } ${ href }" class="Share-link">
                  <svg viewBox="0 0 64 64" width="64" height="64" class="Share-icon">
                    <g fill="none" fill-rule="evenodd">
                      <circle fill="#B5BFC5" cx="32" cy="32" r="32"/>
                      <path d="M15 20v25h34V20H15zm17 15.7L17.6 21.5h29L32 35.7zm-6.3-4.2l-9.2 10.7V22.5l9.2 9zm1 1L32 38l5.3-5.2 9.4 11H17.4l9.3-11zm11.7-1l9.2-9v19.7l-9.2-10.7z" fill="#FFF" fill-rule="nonzero"/>
                    </g>
                  </svg>
                  ${ __('E-mail') }
                </a>
              </li>
            </ul>
            <label class="Share-raw" for="${ URL_ID }">
              <input onclick=${ select } class="Share-url" id="${ URL_ID }" type="text" readonly value="${ href }" />
              <span class="Share-fade"></span>
              ${ CAN_COPY ? html`
                <button class="Share-button" onclick=${ copy } data-oncopy="${ __('Copied!') }">${ __('Copy link') }</button>
              ` : null }
            </label>
          </div>
          <div class="Share-preview">
            ${ props.image ? html`
              <img class="Share-thumbnail" src="${ props.image }" width="64" height="64" />
            ` : null }
            <div class="Share-meta">
              <h2 class="Share-title">${ props.title }</h2>
              <p class="Share-description">${ props.description }</p>
            </div>
          </div>
          <a href="/${ props.href }" class="Share-close js-close" onclick=${ close }>
            <span class="u-hiddenVisually">${ __('Close') }</span>
          </a>
        </div>
      </div>
    `;

    function close(event) {
      emit('ui:share:toggle', false);
      event.preventDefault();
    }

    function select(event) {
      event.target.select();
    }

    function copy(event) {
      const button = event.currentTarget;
      const input = document.getElementById(URL_ID);
      input.select();
      document.execCommand('Copy');
      button.addEventListener('transitionend', function ontransitionend() {
        button.removeEventListener('transitionend', ontransitionend);
        window.setTimeout(() => button.classList.remove('is-active'), 1000);
      });
      button.classList.add('is-active');
    }
  }
});
