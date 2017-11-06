const html = require('choo/html')
const component = require('fun-component')
const { modulate, vh } = require('../base/utils')
const logo = require('../logo')
const nanoraf = require('nanoraf')
const text = require('./text')

module.exports = component({
  name: 'manifest',
  beforerender (element) {
    /**
     * Circumvent mobile viewports calculating `vh` w/o address bar
     */

    element.style.height = `${vh()}px`
  },
  load (element) {
    animate(element)

    const height = element.offsetHeight
    const wheel = element.querySelector('.js-wheel')

    const onscroll = nanoraf(() => {
      const scrollY = window.pageYOffset || window.scollY || 0
      const y = modulate(scrollY, [0, height], [0, (height * -1)], true)
      const z = modulate(scrollY, [0, height], [1, 0.6], true)
      wheel.style.transform = `translateY(${y}px) scale(${z})`
    })

    onscroll()
    window.addEventListener('scroll', onscroll, { passive: true })
    this.unload = function () {
      window.removeEventListener('scroll', onscroll)
    }
  },
  render () {
    return html`
      <article class="Manifest">
        <div class="Manifest-content">
          <div class="Manifest-paper">
            ${text}
          </div>
          <div class="Text Text--growing" style="display:none;">
            <p>The Global Goals are only going to work if we fight for them and you can't fight for your rights if you don’t know what they are.</p>
          </div>
          <p class="Manifest-footer" style="display:none;">
            <a class="Button" href="#goals">Explore the Goals</a>
          </p>
        </div>

        <div class="Manifest-tire">
          <div class="Manifest-wheel js-wheel">
            <div class="Manifest-rim">
              ${logo.symbol()}
            </div>
          </div>
        </div>
      </article>
    `
  }
})

const animate = function (element) {
  const text = element.querySelector('.js-text')
  const words = element.querySelectorAll('.js-word')
  let line = 2
  let total = 0
  let translate = null

  /**
   * Start the tire animation
   */

  element.classList.add('is-animating')

  /**
   * Start the word animation
   */

  words.forEach((word, index) => {
    const time = word.dataset.time || 0
    const next = words[index + 1]

    total += parseInt(time)

    setTimeout(() => {
      /**
       * Trigger next word animation
       */

      word.classList.add('is-visible')

      /**
       * Handle new line
       */

      if (!next) {
        return
      }

      const top = word.getBoundingClientRect().top
      const nextTop = next.getBoundingClientRect().top

      if (translate) {
        text.style.transform = `translateY(${translate * -1}px)`
        translate = null
      } else if (top !== nextTop) {
        translate = (nextTop - top) * line
        line += 1
      }
    }, total)
  })
}
