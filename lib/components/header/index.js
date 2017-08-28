const html = require('choo/html');
const { resolve } = require('../../params');
const component = require('fun-component');
const debounce = require('lodash.debounce');
const nanoraf = require('nanoraf');
const logo = require('../logo');
const { __ } = require('../../locale');

const EXPANDED_STYLES = {
  fillZ: 1.454,
  logoZ: 1.28,
  logoY: 15,
  navY: 71,
  listZ: 1.313,
  toggleY: 40
};

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

module.exports = component({
  name: 'header',
  animation: {},
  update(element, [state]) {
    return true;
  },
  load(element, state) {
    this.elements = {
      'root': element,
      'fill': element.querySelector('.js-fill'),
      'logo': element.querySelector('.js-logo'),
      'nav': element.querySelector('.js-nav'),
      'list': element.querySelector('.js-list'),
      'toggle': element.querySelector('.js-toggle')
    };

    this.prepairAnimation(state);

    window.addEventListener('resize', debounce(this.prepairAnimation.bind(this, state), 500), {passive: true});
    window.addEventListener('scroll', nanoraf(this.animate.bind(this, state)), {passive: true});
    this.elements.nav.addEventListener('touchmove', (e) => e.preventDefault() );
  },
  render(state, goal, emit) {
    this.emit = emit;
    this.href = state.href;
    let styles = {};

    if (typeof window !== 'undefined') {
      styles = this.calculateStyles();
    }

    const actionOnclick = (e) => {
      e.preventDefault();
      state.navigationOpen = false;

      if (e.currentTarget.href === e.currentTarget.getAttribute('href')) {
        window.scrollTo(0, 0);
      } else {
        emit(state.events.PUSHSTATE, e.currentTarget.href);
      }
    }

    const toggleNav = () => {
      emit('navigation:toggle', !state.navigationOpen);
    }

    return html`
      <header class="Header ${ state.navigationOpen ? 'is-open' : '' } ${ goal ? 'Header--adaptive' : '' }" role="banner">
        <div class="Header-bar">
          <div class="Header-fill js-fill" style="${ styles.fill ? `transform: ${ styles.fill }` : '' }"></div>
          <div class="View-section">
            <div class="Header-content">
              <a class="Header-logo js-logo" style="${ styles.fill ? `transform: ${ styles.logo }` : '' }" tabindex="-1" onclick=${ actionOnclick } href="/" rel="home">
                ${ logo(true, goal) }
              </a>
              <nav class="Header-nav js-nav" style="${ styles.fill ? `transform: ${ styles.nav }` : '' }" id="main-navigation">
                <ul class="Header-list js-list" style="${ styles.fill ? `transform: ${ styles.list }` : '' }">
                  ${ LINKS.map(item => item(state)).map(item => html`
                    <li class="Header-item ${ item.isActive ? 'is-active' : '' }">
                      <a class="Header-action" onclick=${ actionOnclick } href="${ item.href }">
                        ${ __(item.title) }
                      </a>
                    </li>
                  `) }
                </ul>
              </nav>
              <button class="Header-toggle js-toggle" style="${ styles.fill ? `transform: ${ styles.toggle }` : '' }" onclick=${ toggleNav } role="button" data-toggle="collapse" data-target="#main-navigation" aria-controls="main-navigation" aria-expanded="${ state.navigationOpen ? 'true' : 'false' }" aria-label="Toggle navigation">
                <span class="Header-toggleText">
                  <span class="u-hiddenVisually">${ 'Open' }</span> ${ 'Menu' }
                </span>
                <span class="Header-toggleText Header-toggleText--close" aria-hidden="true">
                  ${ 'Close' } <span class="u-hiddenVisually">${ 'Menu' }</span>
                </span>
                <div class="Header-lines">
                  <div class="Header-line"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>
    `;
  },
  prepairAnimation(state) {
    const width = window.innerWidth;

    this.animation.start = modulate(width, [375, 1280], [40, 80], true);
    this.animation.stop = modulate(width, [375, 1920], [100, 200], true);
    this.animate(state);
  },
  animate(state) {
    if (state.navigationOpen) {
      return;
    }

    const styles = this.calculateStyles();

    Object.keys(styles).forEach((key) => {
      this.elements[key].style.transform = styles[key];
    });
  },
  calculateStyles() {
    const y = window.scrollY;
    const expanded = EXPANDED_STYLES;

    return {
      fill: `scale(${ this.getValue(y, expanded.fillZ, 1) })`,
      logo: `scale(${ this.getValue(y, expanded.logoZ, 1) }) translateY(${ this.getValue(y, expanded.logoY, 0) }px)`,
      nav: `translateY(${ this.getValue(y, expanded.navY, 0) }%)`,
      list: `scale(${ this.getValue(y, expanded.listZ, 1 ) })`,
      toggle: `translateY(${ this.getValue(y, expanded.toggleY, 0) }%)`
    }
  },
  getValue(scrollY, valueA, valueB) {
    const rangeA = [this.animation.start, this.animation.stop + this.animation.start];
    const rangeB = [valueA, valueB];
    return modulate(scrollY, rangeA, rangeB, true);
  }
});

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
