const html = require('choo/html');
const { resolve } = require('../../params');
const component = require('fun-component');
const debounce = require('lodash.debounce');
const nanoraf = require('nanoraf');
const logo = require('../logo');
const { __ } = require('../../locale');

const STYLES = {
  fillZ: 1.454,
  logoZ: 1.28,
  logoY: 15,
  navY: 71,
  navListZ: 1.313,
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
    this.elements.root.classList.toggle('is-open', state.navigationOpen);
    this.elements.toggle.setAttribute('aria-expanded', this.navigationOpen);

    return state.href !== this.href;
  },
  load(element, state) {
    this.elements = {
      'root': element,
      'fill': element.querySelector('.js-fill'),
      'logo': element.querySelector('.js-logo'),
      'nav': element.querySelector('.js-nav'),
      'navList': element.querySelector('.js-navList'),
      'toggle': element.querySelector('.js-toggle')
    };

    this.prepairAnimation(state)

    window.addEventListener('resize', debounce(this.prepairAnimation.bind(this, state), 500), {passive: true});
    window.addEventListener('scroll', nanoraf(this.animate.bind(this, state)), {passive: true});
    this.elements.nav.addEventListener('touchmove', (e) => e.preventDefault() );
  },
  render(state, goal, emit) {
    this.emit = emit;
    this.href = state.href;

    const actionOnclick = (e) => {
      e.preventDefault();

      /**
       * Handle when user clicks the already active page
       */

      if (e.currentTarget.href === e.currentTarget.getAttribute('href')) {
        window.scrollTo(0, 0);

        if (state.navigaitonOpen) {
          toggleNav();
        }
      } else {
        emit(state.events.PUSHSTATE, e.currentTarget.href);
      }
    }

    const toggleNav = () => {
      emit('navigation:toggle', !state.navigationOpen);
    }

    return html`
      <header class="Header ${ goal ? 'Header--adaptive' : '' }" role="banner">
        <div class="Header-bar">
          <div class="Header-fill js-fill"></div>
          <div class="View-section">
            <div class="Header-content">
              <a class="Header-logo js-logo" tabindex="-1" onclick=${ actionOnclick } href="/" rel="home">
                ${ logo(true, goal) }
              </a>
              <nav class="Header-nav js-nav" id="main-navigation">
                <ul class="Header-list js-navList">
                  ${ LINKS.map(item => item(state)).map(item => html`
                    <li class="Header-item ${ item.isActive ? 'is-active' : '' }">
                      <a class="Header-action" onclick=${ actionOnclick } href="${ item.href }">
                        ${ __(item.title) }
                      </a>
                    </li>
                  `) }
                </ul>
              </nav>
              <button class="Header-toggle js-toggle" onclick=${ toggleNav } role="button" data-toggle="collapse" data-target="#main-navigation" aria-controls="main-navigation" aria-expanded="false" aria-label="Toggle navigation">
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

    if ('initialStyles' in this.animation) {
      this.animation.initialStyles = this.animation.initialStyles;
    } else {
      this.animation.initialStyles = STYLES;
    }

    this.animation.start = modulate(width, [375, 1280], [40, 80], true);
    this.animation.stop = modulate(width, [375, 1920], [100, 200], true);

    this.animate(state);
  },
  animate(state) {
    if (state.navigaitonOpen) {
      return;
    }

    const y = window.scrollY;
    const initial = this.animation.initialStyles;
    const result = this.animation.styles = {
      fill: `scale(${ this.getValue(y, initial.fillZ, 1) })`,
      logo: `scale(${ this.getValue(y, initial.logoZ, 1) }) translateY(${ this.getValue(y, initial.logoY, 0) }px)`,
      nav: `translateY(${ this.getValue(y, initial.navY, 0) }%)`,
      navList: `scale(${ this.getValue(y, initial.navListZ, 1 ) })`,
      toggle: `translateY(${ this.getValue(y, initial.toggleY, 0) }%)`
    }

    Object.keys(result).forEach((key) => {
      this.elements[key].style.transform = result[key];
    });
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
