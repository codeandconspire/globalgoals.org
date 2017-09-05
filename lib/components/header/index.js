const html = require('choo/html');
const component = require('fun-component');
const debounce = require('lodash.debounce');
const nanoraf = require('nanoraf');
const logo = require('../logo');
const links = require('./links');
const modulate = require('./modulate');
const { __ } = require('../../locale');

/**
 * Max transform values for the fully expanded header
 */

const EXPANDED_STYLES = {
  fillY: 40,
  contentY: 20,
  logoZ: 1.3,
  listZ: 1.2
};

const props = {
  name: 'header',
  animation: { start: 0, stop: 0 },
  update() {
    return true;
  },
  load(element, state) {
    this.elements = {
      'root': element,
      'fill': element.querySelector('.js-fill'),
      'content': element.querySelector('.js-content'),
      'logo': element.querySelector('.js-logo'),
      'list': element.querySelector('.js-list')
    };

    this.prepairScroll(state);

    const onResize = debounce(this.prepairScroll.bind(this, state), 500);
    const onScroll = nanoraf(this.handleScroll.bind(this, state));
    const onTouchMove = (e) => { e.preventDefault(); };

    this.handleScroll(state);

    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    element.addEventListener('touchmove', onTouchMove );

    this.unload = function() {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      element.removeEventListener('touchmove', onTouchMove);
    };
  },
  render(state, emit, adaptive) {
    this.adaptive = adaptive;
    let transforms = false;
    let opacity = false;

    if (typeof window !== 'undefined') {
      const y = window.scrollY;

      opacity = this.getOpacity(y);
      if (!adaptive) {
        transforms = this.getTransforms(y);
      }

      this.prepairScroll(state);
    }

    /**
     * Handle link click
     */

    const linkOnClick = (e) => {
      e.preventDefault();
      state.navigationOpen = false;

      if (e.currentTarget.href === e.currentTarget.getAttribute('href')) {
        window.scrollTo(0, 0);
      } else {
        emit(state.events.PUSHSTATE, e.currentTarget.href);
      }
    };

    /**
     * Broadcast that the navigation opens, triggering a rerender here
     */

    const toggleNavigation = (e) => {
      emit('navigation:toggle', !state.navigationOpen);
      document.querySelector('.Header-link').focus();
      e.preventDefault();
    };

    /**
     * The markup contains the transform values so we don't loose them when the
     * navigation opens
     */

    return html`
      <header class="Header ${ adaptive ? 'Header--adaptive' : '' } ${ state.navigationOpen ? 'is-open' : '' }" style="${ opacity ? `opacity: ${ opacity }` : '' }" id="navigation" role="banner">
        <div class="Header-bar">
          <div class="Header-fill js-fill" style="${ transforms.fill ? `transform: ${ transforms.fill }` : '' }"></div>
          <div class="View-section">
            <div class="Header-content js-content" style="${ transforms.fill ? `transform: ${ transforms.content }` : '' }">
              <a class="Header-logo js-logo" style="${ transforms.fill ? `transform: ${ transforms.logo }` : '' }" onclick=${ linkOnClick } href="/" rel="home">
                ${ logo(true) }
              </a>
              <a href="#navigation" class="Header-toggle" onclick=${ toggleNavigation } role="button" data-toggle="collapse" data-target="#main-navigation" aria-controls="main-navigation" aria-expanded="${ state.navigationOpen ? 'true' : 'false' }" aria-label="Toggle navigation">
                <span class="Header-toggleText">
                  <span class="u-hiddenVisually">${ 'Open' }</span> ${ 'Menu' }
                </span>
                <span class="Header-toggleText Header-toggleText--close" aria-hidden="true">
                  ${ 'Close' } <span class="u-hiddenVisually">${ 'Menu' }</span>
                </span>
                <div class="Header-lines"><div class="Header-line"></div></div>
              </a>
              <a href="#" class="Header-toggle Header-toggle--closeFallback">
                ${ 'Close' } <span class="u-hiddenVisually">${ 'Menu' }</span>
              </a>
              <nav class="Header-nav" id="main-navigation">
                <ul class="Header-list js-list" style="${ transforms.fill ? `transform: ${ transforms.list }` : '' }">
                  ${ links.map(item => item(state)).map(item => html`
                    <li class="Header-item ${ item.isActive ? 'is-active' : '' }">
                      <a class="Header-link" onclick=${ linkOnClick } href="${ item.href }">
                        ${ __(item.title) }
                      </a>
                    </li>
                  `) }
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </header>
    `;
  },
  prepairScroll() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    /**
     * Set start and stop scroll positions depending on viewport size
     */

    if (this.adaptive) {
      this.animation.start = height;
      this.animation.stop = 60;
    } else {
      this.animation.start = modulate(width, [375, 1280], [40, 80], true);
      this.animation.stop = modulate(width, [375, 1920], [100, 200], true);
    }
  },
  handleScroll(state) {
    if (state.navigationOpen) {
      return;
    }

    const y = window.scrollY;

    if (this.adaptive) {
      if (y > 400) {
        this.elements.root.classList.add('is-following');
      } else {
        this.elements.root.classList.remove('is-following');
      }
      this.elements.root.style.opacity = this.getOpacity(y);

    } else {
      let transforms = this.getTransforms(y);

      Object.keys(transforms).forEach((key) => {
        this.elements[key].style.transform = transforms[key];
      });
    }
  },
  getTransforms(y) {
    const expanded = EXPANDED_STYLES;

    return {
      fill: `translateY(${ this.getValue(y, expanded.fillY, 0) }px)`,
      content: `translateY(${ this.getValue(y, expanded.contentY, 0) }px)`,
      logo: `scale(${ this.getValue(y, expanded.logoZ, 1) })`,
      list: `scale(${ this.getValue(y, expanded.listZ, 1) })`
    };
  },
  getOpacity(y) {
    return this.getValue(y, 0, 1);
  },
  getValue(scrollY, valueA, valueB) {
    const anim = this.animation;
    const rangeA = [anim.start, anim.stop + anim.start];
    const rangeB = [valueA, valueB];

    return modulate(scrollY, rangeA, rangeB, true);
  }
};

const header = component(props);

/**
 * Let other things get this elements height
 */

Object.defineProperty(header, 'height', {
  get() { return props.elements.fill.getBoundingClientRect().height; }
});

module.exports = header;
