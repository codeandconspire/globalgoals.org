const html = require('choo/html');

module.exports = function header(error) {
  return html`
    <div class="View-section">
      <div class="Header">
        <a class="Header-logo" href="/">
          <img class="Header-img" alt="The Global Goals logotype" src="/logo/horizontal.svg" />
        </a>
        <nav class="Header-nav">
          <ul class="Header-list">
            <li class="Header-item"><a class="Header-action" href="/">The Goals</a></li>
            <li class="Header-item"><a class="Header-action" href="/initiatives">Initiatives</a></li>
            <li class="Header-item"><a class="Header-action" href="/news">News</a></li>
            <li class="Header-item"><a class="Header-action" href="/resources">Resources</a></li>
          </ul>
        </nav>
      </div>
    </div>
  `;
};
