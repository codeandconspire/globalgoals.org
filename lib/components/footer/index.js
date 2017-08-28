const html = require('choo/html');
const logo = require('../logo');

module.exports = function footer(state) {
  let visible;
  if (typeof window !== 'undefined') {
    visible = true;
  }

  return html`
    <footer class="Footer ${ visible ? 'is-visible' : '' }" role="contentinfo">
      <nav class="View-section">
        <div class="Footer-content">
          <div class="Footer-column Footer-column--logo">
            <div class="Footer-logo">
              ${ logo(false) }
            </div>
          </div>
          <div class="Footer-column">
            <h2 class="Footer-title">Navigation</h2>
            <ul class="Footer-list">
              <li class="Footer-item"><a class="Footer-link" href="/">The Goals</a></li>
              <li class="Footer-item"><a class="Footer-link" href="/initiatives">Initiatives</a></li>
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
                <li class="Footer-item"><a tabindex="-1" class="Footer-link u-bg${ goal + 1 }" href="/${ goal + 1 }">Goal ${ goal + 1 }</a></li>
              `) }
            </ul>
          </div>
          <div class="Footer-column Footer-column--credits">
            <h2 class="Footer-title">Credits</h2>
            <ul class="Footer-list">
              <li class="Footer-item">
                <a class="Footer-blockLink" href="https://un.org">
                  <div class="Footer-figure">
                    <img class="Footer-figureImg" height="32" src="un.svg">
                  </div>
                  In support of <em class="Footer-name">The United Nations</em>
                </a>
              </li>
              <li class="Footer-item">
                <a class="Footer-blockLink" href="https://project-everyone.org">
                  <div class="Footer-figure">
                    <img class="Footer-figureImg" height="27" src="project-everyone.png">
                  </div>
                  Produced by <em class="Footer-name">Project Everyone</em>
                </a>
              </li>
              <li class="Footer-item">
                <a class="Footer-blockLink" href="https://gettyimages.com">
                  <div class="Footer-figure">
                    <img class="Footer-figureImg" height="18" src="getty-images.svg">
                  </div>
                  Visual content partner <em class="Footer-name">Getty Images</em>
                </a>
              </li>
              <li class="Footer-item">
                <a class="Footer-blockLink" href="https://thenewdivision.world">
                  <div class="Footer-figure">
                    <img class="Footer-figureImg" height="23" src="the-new-division.svg">
                  </div>
                  Brand design by <em class="Footer-name">The New Division</em>
                </a>
              </li>
              <li class="Footer-item">
                <a class="Footer-blockLink" href="http://trollback.com">
                  <div class="Footer-figure">
                    <img class="Footer-figureImg" height="10" src="trollback.svg">
                  </div>
                  Icons and Logotype <em class="Footer-name">Trollbäck+Company</em>
                </a>
              </li>
              <li class="Footer-item">
                <a class="Footer-blockLink" href="https://codeandconspire.com">
                  <div class="Footer-figure">
                    <img class="Footer-figureImg" height="19" src="code-and-conspire.png">
                  </div>
                  Digital Innovation by <em class="Footer-name">code & conspire</em>
                </a>
              </li>
            </ul>
          </div>
          <div class="Footer-column Footer-column--horizontal">
            <h2 class="Footer-title">On Social Media Platforms</h2>
            <ul class="Footer-list Footer-list--social">
              <li class="Footer-item">
                <a class="Footer-link" href="https://www.facebook.com/globalgoals.org" style="background-image:url('facebook.svg')">Facebook</a>
              </li>
              <li class="Footer-item">
                <a class="Footer-link" href="https://twitter.com/TheGlobalGoals" style="background-image:url('twitter.svg')">Twitter</a>
              </li>
              <li class="Footer-item">
                <a class="Footer-link" href="https://www.instagram.com/TheGlobalGoals/" style="background-image:url('instagram.png')">Instagram</a>
              </li>
              <li class="Footer-item">
                <a class="Footer-link" href="https://www.youtube.com/channel/UCRfuAYy7MesZmgOi1Ezy0ng" style="background-image:url('youtube.svg')">YouTube</a>
              </li>
            </ul>
            <h2 class="Footer-title">Content information</h2>
            <ul class="Footer-list">
              <li class="Footer-item"><a class="Footer-link" href="/terms">Terms & Conditions</a></li>
              <li class="Footer-item"><a class="Footer-link" href="/privacy-policy">Privacy Policy</a></li>
              <li class="Footer-item"><a class="Footer-link" href="/anti-corruption-policy">Anti-Corruption Policy</a></li>
              <li class="Footer-item"><a class="Footer-link" href="/asset-licence">Asset Licence</a></li>
              <li class="Footer-item"><a class="Footer-link" href="/partners">Partners</a></li>
            </ul>
          </div>
        </div>
      </nav>
    </footer>
  `;
};
