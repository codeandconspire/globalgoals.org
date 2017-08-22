const html = require('choo/html');

module.exports = function footer(state) {
  return html`
    <footer class="Footer" role="contentinfo">
      <nav class="View-section">
        <div class="Footer-column">
          <h2 class="Footer-title">Navigation</h2>
          <ul class="Footer-list">
            <li class="Footer-item"><a class="Footer-link" href="/">The Goals</a></li>
            <li class="Footer-item"><a class="Footer-link" href="/activities">Activities</a></li>
            <li class="Footer-item"><a class="Footer-link" href="/news">News</a></li>
            <li class="Footer-item"><a class="Footer-link" href="/resources">Resources</a></li>
          </ul>
        </div>
        <div class="Footer-column">
          <h2 class="Footer-title">Shortcuts</h2>
          <ul class="Footer-list">
            <li class="Footer-item"><a class="Footer-link" href="/press-releases">Press Releases</a></li>
            <li class="Footer-item"><a class="Footer-link" href="/partners">Partners</a></li>
            <li class="Footer-item"><a class="Footer-link" href="/project-everyone">Project Everyone</a></li>
            <li class="Footer-item"><a class="Footer-link" href="/contact">Contact us</a></li>
          </ul>
        </div>
        <div class="Footer-column Footer-column--goals">
          <h2 class="Footer-title">The Goals</h2>
          <ul class="Footer-list">
            ${ [...Array(state.goals.total).keys()].map(goal => html`
              <li class="Footer-item"><a class="Footer-link u-bg${ goal + 1 }" href="/${ goal + 1 }">Goal ${ goal + 1 }</a></li>
            `) }
          </ul>
        </div>
        <div class="Footer-column Footer-column--wide">
          <h2 class="Footer-title">Credits</h2>
          <ul class="Footer-list">
            <li class="Footer-item">In support of <a class="Footer-link" href="https://un.org">The United Nations</a></li>
            <li class="Footer-item">Produced by <a class="Footer-link" href="https://project-everyone.org">Project Everyone</a></li>
            <li class="Footer-item">Designed by <a class="Footer-link" href="https://thenewdivision.world">The New Division</a></li>
            <li class="Footer-item">Digital Innovation<a class="Footer-link" href="https://codeandconspire.com">code & conspire</a></li>
          </ul>
        </div>
        <div class="Footer-column Footer-column--horizontal">
          <h2 class="Footer-title">Content information</h2>
          <ul class="Footer-list">
            <li class="Footer-item"><a class="Footer-link" href="/terms">Terms and About Cookies</a></li>
            <li class="Footer-item"><a class="Footer-link" href="/anti-corruption-policy">Anti-Corruption Policy</a></li>
            <li class="Footer-item"><a class="Footer-link" href="/asset-licence">Asset Licence</a></li>
          </ul>
        </div>
      </nav>
    </footer>
  `;
};
