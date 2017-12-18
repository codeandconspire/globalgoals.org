const html = require('choo/html')
const component = require('fun-component')
const debounce = require('lodash.debounce')
const nanoraf = require('nanoraf')
const logo = require('../logo')
const links = require('./links')
const { className, modulate, vh, requestsNewTarget, inBrowser } = require('../base/utils')
const { resolve } = require('../../params')
const { __ } = require('../../locale')

const SCROLL_FADE_DURATION = 35
const SCROLL_SHRINK_DELAY = 50
const SCROLL_SHRINK_DURATION = 150
const VIEWPORT_MD_MIN = 767
const GOAL_ROUTE_REGEX = /^(goal|media)$/

/**
 * Max transform values for the fully expanded header
 */

const EXPANDED_STYLES = {
  fillY: 40,
  contentY: 20,
  logoZ: 1.25,
  listZ: 1.2
}

const props = {
  name: 'header',
  hasBack: false,
  homeScrollPosition: null,
  shouldTransform: true,
  animation: { start: 0, stop: 0 },
  update (element, [ state ]) {
    const toggle = state.ui.navigationOpen ? 'add' : 'remove'
    document.documentElement.classList[toggle]('has-overlay')

    const routeChanged = state.routeName !== this.route
    const expandedChanged = state.ui.navigationOpen !== this.isOpen

    if (this.hasBack) {
      this.hasBack = state.routeName === 'goal'
    } else {
      this.hasBack = this.route === 'home' && state.routeName === 'goal'
    }

    this.route = state.routeName
    this.isOpen = state.ui.navigationOpen

    return routeChanged || expandedChanged
  },
  load (element, state, emit) {
    this.elements = {
      'root': element,
      'fill': element.querySelector('.js-fill'),
      'content': element.querySelector('.js-content'),
      'logo': element.querySelector('.js-logo'),
      'list': element.querySelector('.js-list')
    }

    this.handleViewportSize(state, emit)

    const onResize = debounce(this.handleViewportSize.bind(this, state, emit), 200)
    const onScroll = nanoraf(this.handleScroll.bind(this, state))
    const preventScroll = (e) => {
      if (this.isOpen) {
        e.preventDefault()
      }
    }

    this.handleScroll(state)

    window.addEventListener('resize', onResize, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    element.addEventListener('touchmove', preventScroll)
    element.addEventListener('wheel', preventScroll)

    this.unload = function () {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
      element.removeEventListener('touchmove', preventScroll)
      element.removeEventListener('wheel', preventScroll)
    }
  },
  render (state, emit, goal) {
    const onGoalPage = this.onGoalPage = GOAL_ROUTE_REGEX.test(state.routeName)
    const black = goal === 7
    let transforms = false
    let opacity = false

    if (inBrowser) {
      const { scrollY } = window

      opacity = this.getOpacity(scrollY)

      if (!onGoalPage) {
        transforms = this.getTransforms(scrollY)
      }

      this.handleViewportSize(state, emit)
    }

    /**
     * Custom link click
     * nanohref will not emit event if one is already on the target page.
     */

    const linkOnClick = e => {
      if (requestsNewTarget(e)) {
        window.open(e.currentTarget.href, '_blank')
        e.preventDefault()
        return
      }

      emit(state.events.PUSHSTATE, e.currentTarget.href)
      e.preventDefault()
    }

    const goBack = e => {
      emit('transitions:popstate', e.currentTarget.href)
      e.preventDefault()
    }

    /**
     * Broadcast that the navigation opens, triggering a rerender here
     */

    const toggle = e => {
      emit('ui:navigation:toggle', !state.ui.navigationOpen)
      document.querySelector('.js-headerLink').focus()
      e.preventDefault()
    }

    /**
     * The markup contains the transform values so we don't lose them when the
     * navigation opens
     */

    const classNames = {
      'Header--goalPage': onGoalPage,
      'Header--black': onGoalPage && black,
      'Header--white': onGoalPage && !black,
      'is-open': state.ui.navigationOpen,
      'is-following': this.isFollowing,
      'is-fromGoalGrid': this.hasBack
    }

    return html`
      <header class="${className('Header', classNames)} ${onGoalPage ? `Header--${goal}` : ''}" style="${opacity ? `opacity: ${opacity}` : ''}" id="navigation">
        <div class="Header-bar">

          <div class="Header-fill js-fill" style="${transforms.fill ? `transform: ${transforms.fill}` : ''}"></div>

          <div class="View-section">
            <div class="Header-content js-content" style="${transforms.content ? `transform: ${transforms.content}` : ''}">

              <a class="Header-logo js-logo" style="${transforms.logo ? `transform: ${transforms.logo}` : ''}" onclick=${linkOnClick} href="${resolve('/')}" rel="home">
                <span class="u-hiddenVisually">${process.env.GLOBALGOALS_NAME}</span>
                ${logo.horizontal()}
              </a>

              <a class="Header-button Header-button--toggle" href="#navigation" draggable="false" onclick=${toggle} role="button" data-toggle="collapse" data-target="#main-navigation" aria-controls="main-navigation" aria-expanded="${state.ui.navigationOpen ? 'true' : 'false'}">
                <span class="Header-toggleText"><span class="u-hiddenVisually">${'Toggle'}</span> ${'Menu'}</span>
              </a>

              <a href="#" draggable="false" class="Header-button Header-button--toggle Header-button--close" onclick=${toggle} role="button" aria-hidden="true">
                <span class="Header-toggleText">${'Close'} <span class="u-hiddenVisually">${'Menu'}</span></span>
              </a>

              <div class="Header-burger"><div class="Header-beanPatty"></div></div>

              <nav class="Header-nav" id="main-navigation">
                <ul class="Header-list js-list" style="${transforms.list ? `transform: ${transforms.list}` : ''}">
                  ${links.primary.map(item => item(state)).filter(Boolean).map(item => html`
                    <li class="Header-item">
                      <a class="Header-button Header-button--link ${item.isCurrent ? 'is-current' : ''} js-headerLink" onclick=${linkOnClick} href="${item.href}">
                        ${item.title}
                        <div class="Header-arrow"></div>
                      </a>
                    </li>
                  `)}
                </ul>
              </nav>

              ${this.hasBack ? html`
                <a class="Header-button Header-button--back" onclick=${goBack} href="${resolve('/')}">
                  ${__('Back to Goals')}
                  <div class="Header-arrow"></div>
                </a>
              ` : null}

              <a href="${resolve('/languages')}" class="Header-lang">
                <svg class="Header-langIcon" viewBox="0 0 66 52">
                  <path fill="currentColor" d="M31.4 30.6c-4.2-4.1-7.9-7.7-10-16h14.7V8.4H21.5V.2h-6.3v8.3H.5v6.2h15l-.3 2.1C13.1 25 10.6 30.2.5 35.3l2.1 6.2a31.6 31.6 0 0 0 16.8-18.6c2.1 5.4 5.7 9.8 9.8 13.8l2.2-6.1zm19.4-20.1h-8.4L27.7 51.8H34l4.2-12.4H55l4.2 12.4h6.3L50.8 10.5zM40.3 33.2l6.3-16.5 6.3 16.6-12.6-.1z"/>
                </svg>
                ${__('Languages')}
              </a>
            </div>
          </div>
        </div>
      </header>
    `
  },
  handleViewportSize (state, emit) {
    const width = window.innerWidth

    if (this.shouldTransform !== (width > VIEWPORT_MD_MIN)) {
      this.shouldTransform = width > VIEWPORT_MD_MIN
    }

    /**
     * Set start and stop scroll positions depending on viewport size
     */

    if (this.onGoalPage) {
      this.animation.start = state.ui.headerOffset || vh()
      this.animation.stop = SCROLL_FADE_DURATION
    } else {
      this.animation.start = SCROLL_SHRINK_DELAY
      this.animation.stop = SCROLL_SHRINK_DURATION
    }

    if (state.ui.navigationOpen) {
      if (width > VIEWPORT_MD_MIN) {
        emit('ui:navigation:toggle', false)
      }
    }
  },
  handleScroll (state) {
    if (state.ui.navigationOpen) {
      return
    }

    const y = window.pageYOffset || window.scollY || 0

    if (this.onGoalPage) {
      if (y > (this.animation.start - 100)) {
        this.elements.root.classList.add('is-following')
        this.isFollowing = true
      } else {
        this.elements.root.classList.remove('is-following')
        this.isFollowing = false
      }
      this.elements.root.style.opacity = this.getOpacity(y)
    } else {
      if (!this.shouldTransform) {
        return
      }

      let transforms = this.getTransforms(y)

      Object.keys(transforms).forEach((key) => {
        this.elements[key].style.transform = transforms[key]
      })
    }
  },
  getTransforms (y) {
    const expanded = EXPANDED_STYLES

    return {
      fill: `translateY(${this.getValue(y, expanded.fillY, 0)}px)`,
      content: `translateY(${this.getValue(y, expanded.contentY, 0)}px)`,
      logo: `scale(${this.getValue(y, expanded.logoZ, 1)})`,
      list: `scale(${this.getValue(y, expanded.listZ, 1)})`
    }
  },
  getOpacity (y) {
    return this.getValue(y, 0, 1)
  },
  getValue (scrollY, valueA, valueB) {
    const anim = this.animation
    const rangeA = [anim.start, anim.stop + anim.start]
    const rangeB = [valueA, valueB]

    return modulate(scrollY, rangeA, rangeB, true)
  }
}

const header = component(props)

/**
 * Expose this elements height on module export
 */

Object.defineProperty(header, 'height', {
  get () {
    return props.elements.content.offsetHeight
  }
})

module.exports = header
