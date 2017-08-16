const html = require('choo/html');
const pathToRegExp = require('path-to-regexp');
const { resolve } = require('../../params');
const { __ } = require('../../locale');

const NAV_ITEMS = [
  state => ({
    title: 'The Goals',
    href: resolve(state.routes.home, { referrer: state.params.referrer }),
    isActive: match(state.href, state.routes) === 'home'
  }),
  state => ({
    title: 'Initiatives',
    href: resolve(state.routes.initiatives, { referrer: state.params.referrer }),
    isActive: ['initiatives', 'initiative'].includes(match(state.href, state.routes))
  }),
  state => ({
    title: 'News',
    href: resolve(state.routes.news, { referrer: state.params.referrer }),
    isActive: ['news', 'article'].includes(match(state.href, state.routes))
  }),
  state => ({
    title: 'Resources',
    href: resolve(state.routes.page, { page: 'resources', referrer: state.params.referrer }),
    isActive: match(state.href, state.routes) === 'page'
  })
];

module.exports = function header(state, goal = false) {
  return html`
    <header class="Header ${ goal ? `Header--adaptive Header--${ goal }` : '' }" role="banner">
      <div class="Header-bar">
        <div class="View-section">
          <div class="Header-content">
            <a class="Header-logo" href="/" rel="home">
              <img class="Header-img" draggable="false" alt="The Global Goals logotype" src="/logo/horizontal.svg" />
            </a>
            <nav class="Header-nav">
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
};


/**
 * Find matching route by value and return its key
 * @param {string} href
 * @param {object} routes
 * @return {boolean}
 */

const cache = {};
function match(href, routes) {
  if (cache[href]) {
    return Object.keys(routes).find(key => cache[href].test(routes[key]));
  }

  cache[href] = pathToRegExp(href);

  return match(href, routes);
};
