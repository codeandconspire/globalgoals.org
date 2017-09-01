const html = require('choo/html');
const { resolve } = require('../../params');
const component = require('fun-component');
const debounce = require('lodash.debounce');
const nanoraf = require('nanoraf');
const logo = require('../logo');
const { __ } = require('../../locale');

/**
 * Max transform values for when the header is expanded
 */

const EXPANDED_STYLES = {
  fillY: 40,
  contentY: 20,
  logoZ: 1.3,
  listZ: 1.2
};

/**
 * Navigaiton links
 */

const LINKS = [
  state => ({
    title: __('The Goals'),
    href: resolve(state.routes.home, { referrer: state.params.referrer }),
    isActive: state.routeName === 'home'
  }),
  state => ({
    title: __('Initiatives'),
    href: resolve(state.routes.initiatives, { referrer: state.params.referrer }),
    isActive: ['initiatives', 'initiative'].includes(state.routeName)
  }),
  state => ({
    title: __('News'),
    href: resolve(state.routes.news, { referrer: state.params.referrer }),
    isActive: ['news', 'article'].includes(state.routeName)
  }),
  state => ({
    title: __('Resources'),
    href: '/todo',
    isActive: state.routeName === 'page'
  })
];

const props = {
  name: 'header',
  animation: {},
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

    this.prepairAnimation(state);

    window.addEventListener('resize', debounce(this.prepairAnimation.bind(this, state), 500), { passive: true });
    window.addEventListener('scroll', nanoraf(this.animate.bind(this, state)), { passive: true });

    /**
     * Disable the scroll in the "mobile" navigation
     */

    element.addEventListener('touchmove', (e) => e.preventDefault() );
  },
  render(state, adaptive, emit) {
    this.adaptive = adaptive;
    this.isAdapting = false;
    let styles = {};
    let y;

    /**
     * Determen if adaptive (transparent header) should be initially adapting
     */

    if (typeof window !== 'undefined') {
      y = window.scrollY;
      styles = this.calculateStyles(y);
      this.isAdapting = y < window.innerHeight;
    } else {
      this.isAdapting = true;
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
     * Broadcast that the navigation opens, finally triggering a rerender here
     */

    const toggleNavigation = (e) => {
      emit('navigation:toggle', !state.navigationOpen);
      e.preventDefault();
    };

    /**
     * The markup contains the transform values so we don't loose them when the
     * navigation opens
     */

    return html`
      <header class="Header ${ state.navigationOpen ? 'is-open' : '' } ${ adaptive ? 'Header--adaptive' : '' } ${ this.isAdapting ? 'is-adapting' : '' }" id="navigation" role="banner">
        <div class="Header-bar">
          <div class="Header-fill js-fill" style="${ styles.fill ? `transform: ${ styles.fill }` : '' }"></div>
          <div class="View-section">
            <div class="Header-content js-content" style="${ styles.fill ? `transform: ${ styles.content }` : '' }">
              <a class="Header-logo js-logo" style="${ styles.fill ? `transform: ${ styles.logo }` : '' }" tabindex="-1" onclick=${ linkOnClick } href="/" rel="home">
                ${ logo(true) }
              </a>
              <nav class="Header-nav" id="main-navigation">
                <ul class="Header-list js-list" style="${ styles.fill ? `transform: ${ styles.list }` : '' }">
                  ${ LINKS.map(item => item(state)).map(item => html`
                    <li class="Header-item ${ item.isActive ? 'is-active' : '' }">
                      <a class="Header-link" onclick=${ linkOnClick } href="${ item.href }">
                        ${ __(item.title) }
                      </a>
                    </li>
                  `) }
                </ul>
              </nav>
              <a href="#navigation" class="Header-toggle" onclick=${ toggleNavigation } role="button" data-toggle="collapse" data-target="#main-navigation" aria-controls="main-navigation" aria-expanded="${ state.navigationOpen ? 'true' : 'false' }" aria-label="Toggle navigation">
                <span class="Header-toggleText">
                  <span class="u-hiddenVisually">${ 'Open' }</span> ${ 'Menu' }
                </span>
                <span class="Header-toggleText Header-toggleText--close" aria-hidden="true">
                  ${ 'Close' } <span class="u-hiddenVisually">${ 'Menu' }</span>
                </span>
                <div class="Header-lines">
                  <div class="Header-line"></div>
                </div>
              </a>
              <a href="#" class="Header-toggle Header-toggle--closeFallback">
                ${ 'Close' } <span class="u-hiddenVisually">${ 'Menu' }</span>
              </a>
            </div>
          </div>
        </div>
      </header>
    `;
  },
  prepairAnimation(state) {
    const width = window.innerWidth;
    this.viewportHeight = window.innerHeight;

    /**
     * Set start and stop scroll positions depending on viewport width
     */

    this.animation.start = modulate(width, [375, 1280], [40, 80], true);
    this.animation.stop = modulate(width, [375, 1920], [100, 200], true);
    this.animate(state);
  },
  animate(state) {
    if (state.navigationOpen) {
      return;
    }

    const y = window.scrollY;
    let styles = this.calculateStyles(y);

    if (this.adaptive) {
      if (y >= this.viewportHeight) {
        // Regular style, following on scroll
        this.elements.root.classList.remove('is-adapting');
        this.isAdapting = false;
      } else {
        // Adapting and left at top of page
        this.elements.root.classList.add('is-adapting');
        this.isAdapting = true;
        styles = this.calculateStyles(0);
      }
    }

    Object.keys(styles).forEach((key) => {
      this.elements[key].style.transform = styles[key];
    });
  },
  calculateStyles(y) {
    const expanded = EXPANDED_STYLES;

    return {
      fill: `translateY(${ this.getValue(y, expanded.fillY, 0) }px)`,
      content: `translateY(${ this.getValue(y, expanded.contentY, 0) }px)`,
      logo: `scale(${ this.getValue(y, expanded.logoZ, 1) })`,
      list: `scale(${ this.getValue(y, expanded.listZ, 1) })`
    };
  },
  getValue(scrollY, valueA, valueB) {
    const anim = this.animation;
    const rangeA = [anim.start, anim.stop + anim.start];
    const rangeB = [valueA, valueB];
    return modulate(scrollY, rangeA, rangeB, true);
  }
};

/**
 * Let things get the hight of the header
 */

const header = component(props);

Object.defineProperty(header, 'height', {
  get() { return props.elements.fill.getBoundingClientRect().height; }
});
module.exports = header;

/**
 * Modulate function from Framer.js
 */

function modulate(value, rangeA, rangeB, limit = false) {
  const [fromLow, fromHigh] = Array.from(rangeA);
  const [toLow, toHigh] = Array.from(rangeB);
  const result = toLow + (((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow));

  if (limit === true) {
    if (toLow < toHigh) {
      if (result < toLow) { return toLow; }
      if (result > toHigh) { return toHigh; }
    } else {
      if (result > toLow) { return toLow; }
      if (result < toHigh) { return toHigh; }
    }
  }

  return result;
}
