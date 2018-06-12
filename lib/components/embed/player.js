const assert = require('assert')
const html = require('choo/html')
const raw = require('choo/html/raw')
const Component = require('nanocomponent')
const { __ } = require('../../locale')

class Player extends Component {
  constructor () {
    super('embed-player')
    this.onscroll = (event) => {
      if (this.content) event.preventDefault()
    }
  }

  update (content) {
    const shouldUpdate = content !== this.content

    if (shouldUpdate && content) {
      window.addEventListener('wheel', this.onscroll)
      window.addEventListener('touchmove', this.onscroll)
      window.requestAnimationFrame(() => {
        this.element.focus()
      })
    }

    return shouldUpdate
  }

  close (onclose = Function.prototype) {
    const element = this.element
    const onanimationend = () => {
      element.removeEventListener('animationend', onanimationend)
      window.removeEventListener('wheel', this.onscroll)
      window.removeEventListener('touchmove', this.onscroll)
      this.render(null)
    }
    element.addEventListener('animationend', onanimationend)
    element.classList.add('is-closing')
  }

  createElement (content, onclose) {
    this.content = content

    if (!content) return html`<div class="Embed Embed--hidden"></div>`

    return html`
      <div class="Embed Embed--fullscreen" tabindex="0">
        <div class="Embed-wrapper">
          ${typeof content === 'string' ? html`
            <div class="Embed-iframe">
              <iframe src="${url(content)}" frameborder="0" allowfullscreen>
            </div>
          ` : content}
          </div>
          <button class="Embed-close" onclick=${() => this.close(onclose)}>
            <span class="Embed-cross">
              <span class="u-hiddenVisually">${__('Close')}</span>
            </span>
          </button>
      </div>
    `
  }
}

function url (str) {
  if (/youtube/.test(str)) {
    const id = str.match(/youtube\.com\/watch\?v=(.+)?\??/)[1]
    return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&showinfo=0`
  } else if (/vimeo/.test(str)) {
    const id = str.match(/vimeo\.com\/(.+)?\??/)[1]
    return `https://player.vimeo.com/video/${id}?badge=0&autoplay=1`
  }
}

module.exports = new Player()
