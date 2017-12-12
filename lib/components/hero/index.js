const html = require('choo/html')
const asElement = require('prismic-element')
const { asText } = require('prismic-richtext')
const component = require('fun-component')
const nanoraf = require('nanoraf')
const backgrounds = require('./backgrounds')
const { label, parseIconText } = require('../icon')
const { className, modulate, vh, scrollIntoView } = require('../base/utils')
const { __ } = require('../../locale')
const { href } = require('../../params')

const PARALLAX_AMOUNT = 80

module.exports = function createHero (name) {
  return component({
    name: `hero:${name || 'goal'}`,
    beforerender (element) {
      /**
       * Circumvent mobile viewports calculating `vh` w/o address bar
       */

      element.style.height = this.height = `${vh()}px`
    },
    load (element, state, goal, emit, { background = true }) {
      if (!background) { return }

      const height = element.offsetHeight
      const container = element.querySelector('.js-container')
      const onscroll = nanoraf(() => {
        const scrollY = window.pageYOffset || window.scollY || 0
        const val = modulate(scrollY, [0, height], [0, PARALLAX_AMOUNT], true)
        container.style.transform = `translateY(${val}px)`
      })

      emit('ui:hero:height', element.offsetHeight)

      onscroll()
      window.addEventListener('scroll', onscroll, { passive: true })
      this.unload = function () {
        window.removeEventListener('scroll', onscroll)
      }
    },
    render (state, goal, emit, { background = true }) {
      const doc = state.goals.items.find(item => item.data.number === goal)
      const inTransition = state.transitions.includes('takeover')

      function onclick (event) {
        const target = document.getElementById('targets')
        scrollIntoView(target, { behavior: 'smooth', offsetTop: 0 })
        event.preventDefault()
      }

      return html`
        <section class="${className(`Hero Hero--${goal}`, { 'Hero--takeover': inTransition, [`u-bg${goal}`]: !inTransition })}" style="height: ${this.height}" id="hero">
          <div class="Hero-container js-container" id="hero-content">
            <div class="${className('Hero-title js-title', { 'u-transformTarget': !inTransition })}">
              ${label(goal, parseIconText(doc), 'Hero')}
            </div>

            ${doc ? html`
              <div class="Hero-intro">
                <h1 class="u-hiddenVisually">${asText(doc.data.title)}</h1>
                <div class="u-transformTarget">
                  <div class="Text Text--adaptive Text--growing">
                    ${asElement(doc.data.introduction, href)}
                  </div>
                  <div class="Hero-link">
                    <div class="Text Text--adaptive">
                      <a class="Text-largeLink" href="#targets" onclick=${onclick}>
                        ${__('Explore the Targets')}
                        <svg class="Text-icon" width="20" height="20" viewBox="0 0 20 20">
                          <g transform="rotate(90 10 10)" fill="none" fill-rule="evenodd">
                            <path d="M11.52 10L8 13.52l.73.73L12.98 10 8.73 5.75 8 6.48 11.52 10z" fill="currentColor" />
                            <circle stroke="currentColor" cx="10" cy="10" r="9.5" />
                          </g>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ` : null}

            </div>
          ${background ? backgrounds(goal) : null}
        </section>
      `
    }
  })
}
