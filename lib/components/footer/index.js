const html = require('choo/html');

module.exports = function footer() {
  return html`
    <footer class="Footer" role="contentinfo">
      <nav>
        <ul>
          <li><a href="/terms">Terms and About Cookies</a></li>
          <li><a href="/anti-corruption-policy">Anti-Corruption Policy</a></li>
          <li><a href="/asset-licence">Asset Licence</a></li>
        </ul>
      </nav>
    </footer>
  `;
};
