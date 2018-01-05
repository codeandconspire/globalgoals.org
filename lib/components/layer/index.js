const html = require('choo/html')
const Component = require('nanocomponent')
const { image } = require('../base/utils')
const { __ } = require('../../locale')

module.exports = class Layer extends Component {
  static identity (media) {
    const id = media.slug || (media.link && media.link.url.replace(/[^\w]/g, '-'))
    return `layer-${id}`
  }

  update () {
    return false
  }

  load (element) {
    const close = element.querySelector('.js-close')
    const onscroll = event => event.preventDefault()

    element.focus()

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

    window.addEventListener('wheel', onscroll)
    window.addEventListener('touchmove', onscroll)
    document.documentElement.classList.add('has-overlay')

    this.unload = () => {
      window.removeEventListener('wheel', onscroll)
      window.removeEventListener('touchmove', onscroll)
      document.documentElement.classList.remove('has-overlay')
    }
  }

  createElement (media, onclose) {
    const props = image(media.image, ['small', 'medium', 'large'])

    return html`
      <div class="Layer" onclick=${onclose} tabindex="0">
        <img class="Layer-image js-image" src="${props.src}" alt="${props.alt}" width="${props.width}" height="${props.height}" srcset="${props.srcset}" sizes="${props.sizes}" />
        <button class="Layer-close js-close" onclick=${onclose}>
          ${__('Close')}
        </button>
      </div>
    `
  }
}
