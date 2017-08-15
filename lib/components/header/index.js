const html = require('choo/html');
const { parse } = require('../../params');

const NAV_ITEMS = [
  {
    title: 'The Goals',
    target: '/',
    routes: ['home']
  }, {
    title: 'Initiatives',
    target: '/initiatives',
    routes: ['initiatives', 'initiative']
  }, {
    title: 'News',
    target: '/news',
    routes: ['news', 'article']
  }, {
    title: 'Resources',
    target: '/resources',
    routes: ['resources']
  }
];

module.exports = function header(ctx) {
  return html`
    <header class="Header" role="banner">
      <div class="Header-bar">
        <div class="View-section">
          <div class="Header-content">
            <a class="Header-logo" href="/" rel="home">
              <img class="Header-img" draggable="false" alt="The Global Goals logotype" src="/logo/horizontal.svg" />
            </a>
            <nav class="Header-nav">
              <ul class="Header-list">
                ${ NAV_ITEMS.map((item) => html`
                  <li class="Header-item ${ item.routes.some((key) => (ctx.routes[key] === ctx.route)) ? 'is-active' : '' }">
                    <a class="Header-action" href="${ item.target }">${ item.title }</a>
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
