const html = require('choo/html');
const component = require('fun-component');
const debounce = require('lodash.debounce');
const nanoraf = require('nanoraf');
const logo = require('../logo');
const links = require('./links');
const modulate = require('./modulate');
const { __ } = require('../../locale');

const HAS_WINDOW = typeof window !== 'undefined';

/**
 * Max transform values for the fully expanded header
 */

const EXPANDED_STYLES = {
  fillY: 40,
  contentY: 20,
  logoZ: 1.25,
  listZ: 1.2
};

const props = {
  name: 'header',
  animation: { start: 0, stop: 0 },
  update() {
    return true;
  },
  load(element, state, emit) {
    this.elements = {
      'root': element,
      'fill': element.querySelector('.js-fill'),
      'content': element.querySelector('.js-content'),
      'logo': element.querySelector('.js-logo'),
      'list': element.querySelector('.js-list')
    };

    this.handleViewportSize(state, emit);

    const onResize = debounce(this.handleViewportSize.bind(this, state, emit), 500);
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
  render(state, emit, goal) {
    const onGoalPage = this.onGoalPage = goal;
    const black = goal === 7;
    let transforms = false;
    let opacity = false;
    let fromGoalGrid = false;

    if (HAS_WINDOW) {
      const y = window.scrollY;
      opacity = this.getOpacity(y);

      fromGoalGrid = state.routeFromGoalGrid;
      state.routeFromGoalGrid = false;

      if (!onGoalPage) {
        transforms = this.getTransforms(y);
      }

      this.handleViewportSize(state, emit);
    }

    /**
     * Handle link click
     */

    const linkOnClick = (e) => {
      e.preventDefault();
      state.navigationOpen = false;
      emit(state.events.PUSHSTATE, e.currentTarget.href);
    };

    const goBack = (e) => {
      e.preventDefault();
      emit(state.events.REPLACESTATE, e.currentTarget.href);
    };

    /**
     * Broadcast that the navigation opens, triggering a rerender here
     */

    const toggle = (e) => {
      emit('navigation:toggle', !state.navigationOpen);
      document.querySelector('.Header-button--link').focus();
      e.preventDefault();
    };

    /**
     * The markup contains the transform values so we don't lose them when the
     * navigation opens
     */

    let classNames = [ 'Header' ];

    if (onGoalPage) {
      classNames.push('Header--goalPage');
      if (black) {
        classNames.push('Header--black');
      } else {
        classNames.push('Header--white');
      }
    }

    if (state.navigationOpen) {
      classNames.push('is-open');
    }

    if (fromGoalGrid) {
      classNames.push('is-fromGoalGrid');
    }

    return html`
      <header class="${ classNames.join(' ') }" style="${ opacity ? `opacity: ${ opacity }` : '' }" id="navigation" role="banner">
        <div class="Header-bar">

          <div class="Header-fill js-fill" style="${ transforms.fill ? `transform: ${ transforms.fill }` : '' }"></div>

          <div class="View-section">
            <div class="Header-content js-content" style="${ transforms.content ? `transform: ${ transforms.content }` : '' }">

              <a class="Header-logo js-logo" style="${ transforms.logo ? `transform: ${ transforms.logo }` : '' }" onclick=${ linkOnClick } href="/" rel="home">
                ${ logo({ componentName: 'Header' }) }
              </a>

              <a class="Header-button Header-button--toggle"
                href="#navigation"
                draggable="false"
                onclick=${ toggle }
                role="button"
                data-toggle="collapse"
                data-target="#main-navigation"
                aria-controls="main-navigation"
                aria-expanded="${ state.navigationOpen ? 'true' : 'false' }">

                <span class="Header-toggleText"><span class="u-hiddenVisually">${ 'Toggle' }</span> ${ 'Menu' }</span>
              </a>

              <a href="#" draggable="false" class="Header-button Header-button--toggle Header-button--close" onclick=${ toggle } role="button" aria-hidden="true">
                <span class="Header-toggleText">${ 'Close' } <span class="u-hiddenVisually">${ 'Menu' }</span></span>
              </a>

              <div class="Header-burger"><div class="Header-beanPatty"></div></div>

              <nav class="Header-nav" id="main-navigation">
                <ul class="Header-list js-list" style="${ transforms.list ? `transform: ${ transforms.list }` : '' }">
                  ${ links.map(item => item(state)).map(item => html`
                    <li class="Header-item">
                      <a class="Header-button Header-button--link ${ item.isCurrent ? 'is-current' : '' }" onclick=${ linkOnClick } href="${ item.href }">
                        ${ __(item.title) }
                        <div class="Header-arrow"></div>
                      </a>
                    </li>
                  `) }
                </ul>
              </nav>

              ${ fromGoalGrid ? html`
                <a class="Header-button Header-button--back" onclick=${ goBack } href="/">
                  ${ __('Back to Goals') }
                  <div class="Header-arrow"></div>
                </a>
              ` : null }
            </div>
          </div>
        </div>
      </header>
    `;
  },
  handleViewportSize(state, emit) {
    const width = window.innerWidth;

    /**
     * Set start and stop scroll positions depending on viewport size
     */

    if (this.onGoalPage) {
      this.animation.start = window.innerHeight;
      this.animation.stop = 35;
    } else {
      const width = window.innerWidth;
      this.animation.start = modulate(width, [375, 1280], [40, 80], true);
      this.animation.stop = modulate(width, [375, 1920], [100, 200], true);
    }

    if (state.navigationOpen) {
      if (width > 767) {
        emit('navigation:toggle', false);
      }
    }
  },
  handleScroll(state) {
    if (state.navigationOpen) {
      return;
    }

    const y = window.scrollY;

    if (this.onGoalPage) {
      if (y > (this.animation.start - 100)) {
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
