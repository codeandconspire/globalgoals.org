const html = require('choo/html')
const component = require('fun-component')
const asElement = require('prismic-element')
const createHero = require('../hero')
const { resolve, routes } = require('../../params')
const { icon, parseIconText } = require('../icon')
const { vw, vh } = require('../base/utils')
const { __ } = require('../../locale')

const PRESS_SCALE_FACTOR = 0.97 // Hardcoded in CSS, see ./index.css

module.exports = function createLink (state, goal, emit) {
  return component({
    cache: true,
    name: `goal-link-${goal}`,
    update (element, [doc], [prev]) {
      return doc !== prev && !state.transitions.includes('takeover')
    },
    load (element) {
      if (this.hasLoaded) return
      this.hasLoaded = true

      let start = null
      let isPressed = false
      let isAborted = false

      element.addEventListener('touchstart', onpress, { passive: true })
      element.addEventListener('touchend', onrelease, { passive: true })
      element.addEventListener('mousedown', onpress, { passive: true })
      element.addEventListener('mouseup', onrelease, { passive: true })
      element.addEventListener('dragstart', abort, { passive: true })
      element.addEventListener('touchmove', function ontouchmove (event) {
        if (start && event.touches) {
          const touch = event.touches.item(0)
          const deltaX = Math.abs(touch.clientX - start.clientX)
          const deltaY = Math.abs(touch.clientY, start.clientY)

          if (deltaX > 9 || deltaY > 9) {
            abort()
          }
        }
      }, { passive: true })
      element.addEventListener('click', function onclick (event) {
        const inTransition = state.transitions.includes('takeover')

        if (isAborted || isPressed || inTransition) {
          event.preventDefault()
        }
      })

      function abort () {
        if (isPressed) {
          element.classList.remove('is-pressed')
          isPressed = false
        }

        start = null
        isAborted = true
        window.removeEventListener('keydown', onescape)
        window.removeEventListener('scroll', abort, { passive: true })
      }

      function onescape (event) {
        if (event.key === 'Escape') {
          abort()
        }
      }

      function preventDefault (event) {
        event.preventDefault()
      }

      function onpress (e) {
        if ((e.which && e.which === 3) || (e.button && e.button !== 0) ||
          e.ctrlKey || e.metaKey || e.altKey || e.shiftKey ||
          state.transitions.includes('takeover')) return

        isPressed = true
        isAborted = false
        element.classList.add('is-pressed')

        if (e.touches) {
          const touch = e.touches.item(0)
          start = { clientX: touch.clientX, clientY: touch.clientY }
        }

        window.addEventListener('keydown', onescape)
        window.addEventListener('scroll', abort, { passive: true })
      }

      function onrelease () {
        if (isAborted || !isPressed || state.transitions.includes('takeover')) {
          return
        }

        start = null
        isAborted = false
        isPressed = false
        window.removeEventListener('keydown', onescape)
        window.removeEventListener('scroll', abort, { passive: true })
        window.addEventListener('touchmove', preventDefault)
        window.addEventListener('wheel', preventDefault)

        /**
         * Broadcast transition start
         */

        emit('transitions:start', 'takeover')

        /**
         * Create layers
         */

        const takeover = html`<div class="View-takeover View-takeover--${goal} u-bg${goal}"></div>`
        const hero = createHero('transition')(state, goal, emit, { background: false })

        /**
         * Avoid transitions while calculating layout
         */

        hero.classList.add('no-transition')

        /**
         * Extrapolate origin location (where to animate from)
         */

        const figure = element.querySelector('.js-figure').getBoundingClientRect()
        const box = element.getBoundingClientRect()

        /**
         * Transform takeover into position
         */

        const factor = ((1 - PRESS_SCALE_FACTOR) / 2)
        takeover.style.transform = `
          translate(${box.left + (box.width * factor)}px, ${box.top + (box.height * factor)}px)
          scaleX(${(box.width * PRESS_SCALE_FACTOR) / vw()})
          scaleY(${(box.height * PRESS_SCALE_FACTOR) / vh()})
        `

        window.requestAnimationFrame(() => {
          document.body.appendChild(hero)

          /**
           * Create a clone of the title element that we'll be animating
           */

          const title = hero.querySelector('.js-title')
          const clone = title.cloneNode(true)

          clone.classList.add('is-clone')
          title.parentElement.appendChild(clone)

          /**
           * Render hero in place and read title location (where to animate to)
           */

          document.body.insertBefore(takeover, hero)
          const target = title.getBoundingClientRect()

          /**
           * Put the clone in position on top of the icon label
           */

          Object.assign(clone.style, {
            height: `${target.height}px`,
            width: `${target.width}px`,
            left: `${target.left}px`,
            top: `${target.top}px`,
            transform: `
              translate(${figure.left - target.left}px, ${figure.top - target.top}px)
              scale(${figure.width / target.width})
            `
          })

          /**
           * Navigate when clone is in place
           */

          clone.addEventListener('transitionend', function ontransitionend (event) {
            if (event.target === clone) {
              clone.removeEventListener('transitionend', ontransitionend)
              next()
            }
          })

          /**
           * Cleanup and push state
           */

          let timeout
          function next () {
            window.clearTimeout(timeout)
            window.removeEventListener('touchmove', preventDefault)
            window.removeEventListener('wheel', preventDefault)
            element.classList.remove('is-pressed')
            emit('transitions:pushstate', element.href)
          }

          /**
           * Let em' loose
           */

          window.requestAnimationFrame(() => {
            // Fallback in case the transition never finish
            timeout = window.setTimeout(next, 800)
            hero.classList.remove('no-transition')
            clone.classList.add('in-transition')
            takeover.style.transform = 'translate(0px, 0px) scaleX(1) scaleY(1)'
            clone.style.transform = 'translate(0px, 0px) scale(1)'
          })
        })
      }
    },
    render (doc) {
      const href = resolve(routes.goal, doc || {data: {number: goal}})
      const introduction = doc ? asElement(doc.data.introduction, href) : null

      return html`
        <a class="GoalGrid-item GoalGrid-item--${goal} ${goal === 7 ? ' GoalGrid-item--light' : ''}" href="${href}">
          ${doc ? html`
            <div class="GoalGrid-bg u-bg${goal}">
              <div class="GoalGrid-content">
                <div class="GoalGrid-icon js-figure">
                  <span class="u-hiddenVisually">${__('Goal %s', goal)}</span>
                  ${icon({ goal: goal, text: parseIconText(doc), componentName: 'GoalGrid' })}
                </div>

                <div class="GoalGrid-details">
                  <div class="GoalGrid-desc Text Text--adaptive Text--growingLate">
                    ${introduction}
                  </div>
                  <span class="GoalGrid-button">View Goal</span>
                  <div class="GoalGrid-animation"></div>
                </div>
              </div>
            </div>
          ` : html`
            <div class="GoalGrid-bg"></div>
          `}
        </a>
      `
    }
  })
}
