const html = require('choo/html');
const { parse } = require('../../params');

// Todo: Dynamic?
const NAV_ITEMS = [
  {
    title: 'The Goals',
    route: '/'
  }, {
    title: 'Initiatives',
    route: '/initiatives'
  }, {
    title: 'News',
    route: '/news'
  }, {
    title: 'Resources',
    route: '/resources'
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
                  <li class="Header-item">
                    <a class="Header-action" href="${ item.route }">${ item.title }</a>
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
