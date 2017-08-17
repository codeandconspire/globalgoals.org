const html = require('choo/html');
const pathToRegExp = require('path-to-regexp');
const { resolve } = require('../../params');
const component = require('fun-component');
const debounce = require('lodash.debounce');
const nanoraf = require('nanoraf');
const logo = require('../logo');
const { __ } = require('../../locale');

const ANIMATION_BREAKPOINT = 1250;
const ANIMATION_SPEED = 150;
const BACKGROUND_Z = 1.46;
const LOGO_Z = 1.295;
const LOGO_Y = 18;
const NAV_Z = 1.33;
const NAV_Y = 15;

let inAnimationBreakpoint = false;

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
    href: resolve(state.routes.page, { page: 'resources', referrer: state.params.referrer }),
    isActive: state.routeName === 'page'
  })
];

module.exports = component({
  name: 'header',
  load(element, state, goal) {
    const elements = {
      'background': element.querySelector('.js-background'),
      'logo': element.querySelector('.js-logo'),
      'nav': element.querySelector('.js-nav')
    }

    const scroll = window.scrollY;

    function handleResize() {
      handleBreakpoint(elements, scrollY);
    }

    const handleScroll = nanoraf(() => {
      animate(elements, scrollY);
    });

    window.addEventListener('resize', handleResize, {passive: true});
    handleResize();

    window.addEventListener('scroll', handleScroll, {passive: true});
    handleScroll();

    animate(elements, scrollY, true);

    this.unload = (state, goal) => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    }
  },
  render(state, goal) {
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
                <ul class="Header-list">
                  ${ NAV_ITEMS.map(item => item(state)).map(item => html`
                    <li class="Header-item ${ item.isActive ? 'is-active' : '' }">
                      <a class="Header-action" href="${ item.href }">
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
  }
});

/**
 * Detect if we are on a animation fiendly viewport breakpoint
 */

function handleBreakpoint(elements, scrollY) {
  debounce(() => {
    setAnimationState(elements, scrollY);
  }, 500);
  setAnimationState(elements, scrollY);
}

function setAnimationState(elements, scrollY) {
  inAnimationBreakpoint = window.innerWidth >= ANIMATION_BREAKPOINT;
  animate(elements, scrollY);
}

/**
 * Animate header height
 */

function animate(elements, scrollY, force) {
  if (!inAnimationBreakpoint) {
    elements.background.style.transform = '';
    elements.logo.style.transform = '';
    elements.nav.style.transform = '';
    return;
  }

  const min = 0;
  const max = ANIMATION_SPEED;
  const withinRange = scrollY > min && scrollY < max;

  // if (!withinRange && !force) {
  //   return;
  // }

  const backgroundZ = modulate(scrollY, [0, max], [BACKGROUND_Z, 1], true);
  const logoZ = modulate(scrollY, [0, max], [LOGO_Z, 1], true);
  const logoY = modulate(scrollY, [0, max], [LOGO_Y, 0], true);
  const navZ = modulate(scrollY, [0, max], [NAV_Z, 1], true);
  const navY = modulate(scrollY, [0, max], [NAV_Y, 0], true);

  elements.background.style.transform = `scale(${ backgroundZ })`;
  elements.logo.style.transform = `scale(${ logoZ }) translateY(${ logoY }px)`;
  elements.nav.style.transform = `scale(${ navZ }) translateY(${ navY }px)`;
};

/**
 * Modulate function from Framer.js
 */

function modulate(value, rangeA, rangeB, limit) {
	if (limit == null) {
    limit = false;
  }

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
};
