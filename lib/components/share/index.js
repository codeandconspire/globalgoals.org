const url = require('url')
const html = require('choo/html')
const component = require('fun-component')
const { __ } = require('../../locale')
const { inBrowser } = require('../base/utils')
const glyph = require('../glyph')

const ROOT = process.env.GLOBALGOALS_URL
const URL_ID = `input-${(new Date() % 9e6).toString(36)}`
const CAN_COPY = inBrowser && 'execCommand' in document

module.exports = component({
  name: 'share',
  load (element) {
    const close = element.querySelector('.js-close')
    const onscroll = event => event.preventDefault()

    element.focus()

    /**
     * Create a tab black hole
     */

    element.addEventListener('keydown', event => {
      if (event.target === element && event.shiftKey && event.code === 'Tab') {
        event.preventDefault()
      }
    })
    close.addEventListener('keydown', event => {
      if (!event.shiftKey && event.code === 'Tab') {
        event.preventDefault()
      }
    })

    /**
     * Prevent scroll while share dialog is open
     */

    window.addEventListener('wheel', onscroll)
    window.addEventListener('touchmove', onscroll)
    document.documentElement.classList.add('has-overlay')

    this.unload = () => {
      window.removeEventListener('wheel', onscroll)
      window.removeEventListener('touchmove', onscroll)
      document.documentElement.classList.remove('has-overlay')
    }
  },
  render (props, emit) {
    const href = url.resolve(ROOT, props.href).replace(/\/$/, '')
    const uri = encodeURIComponent(href)

    return html`
      <div class="Share" id="share" tabindex="0">
        <div class="Share-container">
          <div class="Share-body">
            <h2 class="Share-heading">${__('Choose how to share')}</h2>
            <ul class="Share-options">
              <li class="Share-option">
                <a target="_blank" rel="noopener noreferrer"  href="${process.env.FACEBOOK_ID ? `https://www.facebook.com/dialog/share?app_id=${process.env.FACEBOOK_ID}&display=page&href=${uri}&redirect_uri=${uri}` : `https://www.facebook.com/sharer.php?u=${uri}`}" class="Share-link">
                  <div class="Share-icon Share-icon--facebook">
                    ${glyph.facebook('Share-glyph')}
                  </div>
                  ${__('Share')}
                </a>
              </li>
              <li class="Share-option">
                <a target="_blank" rel="noopener noreferrer"  href="https://twitter.com/intent/tweet?url=${uri}&text=${encodeURIComponent(props.description)}&${process.env.TWITTER_USERNAME ? `via=${process.env.TWITTER_USERNAME}` : ''}" class="Share-link">
                  <div class="Share-icon Share-icon--twitter">
                    ${glyph.twitter('Share-glyph')}
                  </div>
                  ${__('Tweet')}
                </a>
              </li>
              <li class="Share-option">
                <a target="_blank" rel="noopener noreferrer"  href="http://service.weibo.com/share/share.php?url=${uri}&appkey=&title=${encodeURIComponent(props.description)}&pic=&ralateUid=" class="Share-link">
                  <div class="Share-icon Share-icon--weibo">
                    ${glyph.weibo('Share-glyph')}
                  </div>
                  ${__('Share')}
                </a>
              </li>
              <li class="Share-option">
                <a target="_blank" rel="noopener noreferrer"  href="http://vk.com/share.php?url=${uri}" class="Share-link">
                  <div class="Share-icon Share-icon--vk">
                    ${glyph.vk('Share-glyph')}
                  </div>
                  ${__('Share')}
                </a>
              </li>
              ${props.asset ? html`
                <li class="Share-option">
                  <a target="_blank" rel="noopener noreferrer"  href="${props.asset}" class="Share-link" download>
                    <div class="Share-icon Share-icon--download">
                      ${glyph.download('Share-glyph')}
                    </div>
                    ${__('Download')}
                  </a>
                </li>
              ` : null}
              <li class="Share-option">
                <a href="mailto:?subject=${props.title}&body=${props.description} ${href}" class="Share-link">
                  <div class="Share-icon Share-icon--mail">
                    ${glyph.mail('Share-glyph')}
                  </div>
                  ${__('Email')}
                </a>
              </li>
            </ul>
            <label class="Share-raw" for="${URL_ID}">
              <input onclick=${select} class="Share-url" id="${URL_ID}" type="text" readonly value="${href}" />
              <span class="Share-fade"></span>
              ${CAN_COPY ? html`
                <button class="Share-button" onclick=${copy} data-oncopy="${__('Copied!')}">${__('Copy link')}</button>
              ` : null}
            </label>
          </div>
          <div class="Share-preview">
            ${props.image ? html`
              <img class="Share-thumbnail" src="${props.image}" width="64" height="64" />
            ` : html`
              <img class="Share-thumbnail" src="/share.png" width="64" height="64" />
            `}
            <div class="Share-meta">
              <h2 class="Share-title">${props.title}</h2>
              <p class="Share-description">${props.description.split(' ').reduce((description, word) => {
                return description + (description.length < 110 ? (' ' + word) : '')
              }, '')}…</p>
            </div>
          </div>
          <a href="/${props.href}" class="Share-close js-close" onclick=${close}>
            <span class="u-hiddenVisually">${__('Close')}</span>
          </a>
        </div>
      </div>
    `

    function close (event) {
      emit('ui:share:toggle', false)
      event.preventDefault()
    }

    function select (event) {
      event.target.select()
    }

    function copy (event) {
      const button = event.currentTarget
      const input = document.getElementById(URL_ID)
      input.select()
      document.execCommand('Copy')
      button.addEventListener('transitionend', function ontransitionend () {
        button.removeEventListener('transitionend', ontransitionend)
        window.setTimeout(() => button.classList.remove('is-active'), 1000)
      })
      button.classList.add('is-active')
    }
  }
})
