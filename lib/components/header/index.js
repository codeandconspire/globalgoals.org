const html = require('choo/html');
const { resolve } = require('../../params');
const component = require('fun-component');
const debounce = require('lodash.debounce');
const nanoraf = require('nanoraf');
const logo = require('../logo');
const { __ } = require('../../locale');

const BACKGROUND_Z = 1.454;
const LOGO_Z = 1.28;
const LOGO_Y = 15;
const NAV_Y = 71;
const NAV_LIST_Z = 1.313;
const TOGGLE_Y = 53.1;

let animationStart, animationDistance;

const NAV_ITEMS = [
  state => ({
    title: 'The Goals',
    href: resolve(state.routes.home, { referrer: state.params.referrer }),
    isActive: state.routeName === 'home'
  }),
  state => ({
    title: 'Initiatives',
    href: resolve(state.routes.initiatives, { referrer: state.params.referrer }),
    isActive: ['initiatives', 'initiative'].includes(state.routeName)
  }),
  state => ({
    title: 'News',
    href: resolve(state.routes.news, { referrer: state.params.referrer }),
    isActive: ['news', 'article'].includes(state.routeName)
  }),
  state => ({
    title: 'Resources',
    href: '/todo',
    isActive: state.routeName === 'page'
  })
];

module.exports = component({
  name: 'header',
  update(element, [state]) {
    return state.href !== this.href;
  },
  load(element) {
    const elements = {
      'background': element.querySelector('.js-background'),
      'logo': element.querySelector('.js-logo'),
      'nav': element.querySelector('.js-nav'),
      'navList': element.querySelector('.js-navList'),
      'toggle': element.querySelector('.js-toggle')
    };

    const handleResize = () => {
      handleBreakpoint(elements, scrollY);
    }

    const handleScroll = nanoraf(() => {
      animate(elements, scrollY);
    });

    const handleToggleClick = (event) => {
      toggleNav(elements, event);
    }

    window.addEventListener('resize', handleResize, {passive: true});
    window.addEventListener('scroll', handleScroll, {passive: true});
    handleResize();
    handleScroll();

    animate(elements, scrollY);

    elements.toggle.addEventListener('click', handleToggleClick);

    this.unload = () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      elements.toggle.removeEventListener('click', handleToggleClick);
    };
  },
  render(state, goal) {
    this.href = state.href;

    return html`
      <header class="Header ${ goal ? `Header--adaptive Header--${ goal }` : '' }" role="banner">
        <div class="Header-bar">
          <div class="Header-background js-background"></div>
          <div class="View-section">
            <div class="Header-content">
              <a class="Header-logo js-logo" href="/" rel="home">
                ${ logo(true, goal) }
              </a>
              <nav class="Header-nav js-nav">
                <ul class="Header-list js-navList">
                  ${ NAV_ITEMS.map(item => item(state)).map(item => html`
                    <li class="Header-item ${ item.isActive ? 'is-active' : '' }">
                      <a class="Header-action" href="${ item.href }">
                        ${ __(item.title) }
                      </a>
                    </li>
                  `) }
                </ul>
              </nav>
              <button class="Header-toggle js-toggle" role="button">${ __('Show Navigation') }</button>
            </div>
          </div>
        </div>
      </header>
    `;
  }
});

/**
 * Detect if we are on a animation fiendly viewport breakpoint
 */

function handleBreakpoint(elements, scrollY) {
  debounce(() => setAnimationState(elements, scrollY), 500);
  setAnimationState(elements, scrollY);
}

function setAnimationState(elements, scrollY) {
  animationStart = Math.floor(modulate(window.innerWidth, [375, 1280], [30, 100], true));
  animationDistance = Math.floor(modulate(window.innerWidth, [375, 1920], [100, 200], true));

  animate(elements, scrollY);
}

/**
 * Animate header height
 */

function animate(elements, scrollY) {
  const start = animationStart;
  const distance = animationDistance + animationStart;

  const backgroundZ = modulate(scrollY, [start, distance], [BACKGROUND_Z, 1], true);
  const logoZ = modulate(scrollY, [start, distance], [LOGO_Z, 1], true);
  const logoY = modulate(scrollY, [start, distance], [LOGO_Y, 0], true);
  const navY = modulate(scrollY, [start, distance], [NAV_Y, 0], true);
  const navListZ = modulate(scrollY, [start, distance], [NAV_LIST_Z, 1], true);
  const toggleY = modulate(scrollY, [start, distance], [TOGGLE_Y, 0], true);

  elements.background.style.transform = `scale(${ backgroundZ })`;
  elements.logo.style.transform = `scale(${ logoZ }) translateY(${ logoY }px)`;
  elements.nav.style.transform = `translateY(${ navY }%)`;
  elements.navList.style.transform = `scale(${ navListZ })`;
  elements.toggle.style.transform = `translateY(${ toggleY }%)`;
}

/**
 * Toggle navigation
 */

function toggleNav(elements, event) {
  console.log('toggle nav')
  event.preventDefault();
}

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
