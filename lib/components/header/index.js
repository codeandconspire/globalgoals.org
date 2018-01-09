const html = require('choo/html')
const Component = require('nanocomponent')
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
const VIEWPORT_LG_MIN = 1023
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

class Header extends Component {
  constructor () {
    super('header')

    this.elements = {}
    this.hasBack = false
    this.homeScrollPosition = null
    this.shouldTransform = true
    this.animation = { start: 0, stop: 0 }

    /**
     * Expose this elements height on module export
     */

    Object.defineProperty(this, 'height', {
      get: () => this.elements.content.offsetHeight
    })
  }

  update (state, emit) {
    const toggle = state.ui.navigationOpen ? 'add' : 'remove'
    document.documentElement.classList[toggle]('has-overlay')

    const routeChanged = state.routeName !== this.route
    const expandedChanged = state.ui.navigationOpen !== this.isOpen

    if (this.hasBack) {
      this.hasBack = state.routeName === 'goal'
    } else {
      this.hasBack = this.route === 'home' && state.routeName === 'goal'
    }

    if (expandedChanged) {
      const method = state.ui.navigationOpen ? 'add' : 'remove'
      this.element[`${method}EventListener`]('touchmove', this)
      this.element[`${method}EventListener`]('wheel', this)
    }

    return routeChanged || expandedChanged
  }

  load (element) {
    const [state, emit] = this._arguments

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

    this.handleScroll(state)

    window.addEventListener('resize', onResize, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })

    this.unload = function () {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
    }
  }

  handleEvent (event) {
    if ((event.type === 'touchmove' || event.type === 'wheel') && this.isOpen) {
      event.preventDefault()
    }
  }

  createElement (state, emit) {
    this.route = state.routeName
    this.isOpen = state.ui.navigationOpen

    const onGoalPage = this.onGoalPage = GOAL_ROUTE_REGEX.test(state.routeName)
    const black = state.params.goal === 7
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
      <header class="${className('Header', classNames)} ${onGoalPage ? `Header--${state.params.goal}` : ''}" style="${opacity ? `opacity: ${opacity}` : ''}" id="navigation">
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
                      <a class="${className('Header-button Header-button--link', { 'is-current': item.isCurrent, 'Header-button--external': item.external })} js-headerLink" target="${item.external ? '_blank' : '_self'}" onclick=${item.external ? null : linkOnClick} href="${item.href}">
                        ${item.title}
                        ${item.external ? html`
                          <div>
                            <svg class="Header-external" width="20" height="20" viewBox="0 0 20 20">
                              <g fill="currentColor" transform="translate(.5 .5)">
                                <rect width="1.25" height="15.385" x="17.61" y=".1"/>
                                <polygon points="10.59 -6.92 11.84 -6.92 11.84 8.36 10.59 8.36" transform="rotate(90 11.215 .72)"/>
                                <polygon points="8.646 -2.626 9.896 -2.626 9.896 22.013 8.646 22.013" transform="rotate(45 9.27 9.694)"/>
                              </g>
                            </svg>
                            <svg class="Header-external Header-external--small" viewBox="0 0 13 13">
                              <g fill-rule="evenodd">
                                <path d="M12 0h1v9h-1z"/>
                                <path d="M13 0v1H4V0z"/>
                                <path d="M12.1.2l.7.7L1.3 12.4l-.7-.7z"/>
                              </g>
                            </svg>
                            ${item.desc ? html`<span class="Header-tooltip">${__('Leave this website, go to')} <br>${item.desc}</span>` : null}
                          </div>
                        ` : html`
                          <div class="Header-arrow"></div>
                        `}
                      </a>
                    </li>
                  `)}
                  <li class="Header-item">
                    <a href="${resolve('/languages')}" class="Header-button Header-button--link Header-button--lang js-headerLink">
                      <svg class="Header-langIcon" viewBox="0 0 28 22" width="28" height="22">
                        <path fill="currentColor" fill-rule="evenodd" d="M12,5.0000127 L12,9 L18,9 L18,12 L12.2927062,12 C12.847937,13.858339 14.1997637,15.6390683 16.4051522,17.3617431 L14.5584098,19.7259644 C12.9871676,18.4986344 11.7403138,17.1976122 10.8290235,15.826734 C9.55918296,18.5358906 7.26558309,20.8377252 3.99238314,22.7020471 L2.50761686,20.0952351 C6.296618,17.9371274 8.38153788,15.2658259 8.88133712,12 L3,12 L3,9 L9,9 L9,5.00022811 L9,5.00006369 L12,5 Z M20.1721734,23.5 L19.1999512,27 L16,27 L21,9 L24.1999512,9 L25,9 L30,27 L26.8000488,27 L25.8278266,23.5 L20.1721734,23.5 Z M20.9360623,20.75 L25.0639377,20.75 L23,13.3198242 L20.9360623,20.75 Z" transform="translate(-2 -5)"/>
                      </svg>
                      <div class="Header-arrow"></div>
                      <span class="Header-tooltip">${__('Languages')}</span>
                    </a>
                  </li>
                </ul>
              </nav>

              ${this.hasBack ? html`
                <a class="Header-button Header-button--back" onclick=${goBack} href="${resolve('/')}">
                  ${__('Back to Goals')}
                  <div class="Header-arrow"></div>
                </a>
              ` : null}
            </div>
          </div>
        </div>
      </header>
    `
  }

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
      if (width > VIEWPORT_LG_MIN) {
        emit('ui:navigation:toggle', false)
      }
    }
  }

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
  }

  getTransforms (y) {
    const expanded = EXPANDED_STYLES

    return {
      fill: `translateY(${this.getValue(y, expanded.fillY, 0)}px)`,
      content: `translateY(${this.getValue(y, expanded.contentY, 0)}px)`,
      logo: `scale(${this.getValue(y, expanded.logoZ, 1)})`,
      list: `scale(${this.getValue(y, expanded.listZ, 1)})`
    }
  }

  getOpacity (y) {
    return this.getValue(y, 0, 1)
  }

  getValue (scrollY, valueA, valueB) {
    const anim = this.animation
    const rangeA = [anim.start, anim.stop + anim.start]
    const rangeB = [valueA, valueB]

    return modulate(scrollY, rangeA, rangeB, true)
  }
}

module.exports = new Header()
