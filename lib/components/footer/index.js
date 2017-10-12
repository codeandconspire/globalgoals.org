const html = require('choo/html');
const logo = require('../logo');

module.exports = function footer(state) {
  const goals = [];
  for (let i = 0; i < state.goals.total; i += 1) {
    goals.push(i + 1);
  }

  return html`
    <footer class="Footer">
      <nav class="View-section">
        <div class="Footer-content">
          <div class="Footer-column Footer-column--logo">
            <div class="Footer-logo">
              ${ logo.vertical() }
            </div>
          </div>
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
              ${ goals.map(goal => html`
                <li class="Footer-item"><a tabindex="-1" class="Footer-link u-bg${ goal }" href="/${ goal }">Goal ${ goal }</a></li>
              `) }
            </ul>
          </div>
          <div class="Footer-column Footer-column--credits">
            <h2 class="Footer-title">Credits</h2>
            <ul class="Footer-list">
              <li class="Footer-item">
                <a class="Footer-blockLink" href="https://un.org">
                  <div class="Footer-figure">
                    <img class="Footer-figureImg" alt="The United Nations" height="32" src="/un.svg">
                  </div>
                  <div class="Footer-blockLinkTarget">In support of <em class="Footer-name">The United Nations</em></div>
                </a>
              </li>
              <li class="Footer-item">
                <a class="Footer-blockLink" href="https://project-everyone.org">
                  <div class="Footer-figure">
                    <img class="Footer-figureImg" alt="Project Everyone" height="27" src="/project-everyone.svg">
                  </div>
                  <div class="Footer-blockLinkTarget">Produced by <em class="Footer-name">Project Everyone</em></div>
                </a>
              </li>
              <li class="Footer-item">
                <a class="Footer-blockLink" href="https://gettyimages.com">
                  <div class="Footer-figure">
                    <img class="Footer-figureImg" alt="Getty Images" height="18" src="/getty-images.svg">
                  </div>
                  <div class="Footer-blockLinkTarget">Visual content partner <em class="Footer-name">Getty Images</em></div>
                </a>
              </li>
              <li class="Footer-item">
                <a class="Footer-blockLink" href="https://thenewdivision.world">
                  <div class="Footer-figure">
                    <img class="Footer-figureImg" alt="The New Division" height="23" src="/the-new-division.svg">
                  </div>
                  <div class="Footer-blockLinkTarget">Brand design by <em class="Footer-name">The New Division</em></div>
                </a>
              </li>
              <li class="Footer-item">
                <a class="Footer-blockLink" href="http://trollback.com">
                  <div class="Footer-figure">
                    <img class="Footer-figureImg" alt="Trollbäck + Company" height="10" src="/trollback.svg">
                  </div>
                  <div class="Footer-blockLinkTarget">Icons and Logotype <em class="Footer-name">Trollbäck+Company</em></div>
                </a>
              </li>
              <li class="Footer-item">
                <a class="Footer-blockLink" href="http://codeandconspire.com">
                  <div class="Footer-figure">
                    <img class="Footer-figureImg" alt="Code and Conspire" height="19" src="/code-and-conspire.svg">
                  </div>
                  <div class="Footer-blockLinkTarget">Digital Innovation by <em class="Footer-name">code&conspire</em></div>
                </a>
              </li>
            </ul>
          </div>
          <div class="Footer-column Footer-column--horizontal">
            <h2 class="Footer-title">On Social Media Platforms</h2>
            <ul class="Footer-list Footer-list--social">
              <li class="Footer-item">
                <a class="Footer-link" href="https://www.facebook.com/globalgoals.org">
                  <span class="Footer-social" style="background-image:url('/facebook.svg')">Facebook</span>
                </a>
              </li>
              <li class="Footer-item">
                <a class="Footer-link" href="https://twitter.com/TheGlobalGoals">
                  <span class="Footer-social" style="background-image:url('/twitter.svg')">Twitter</span>
                </a>
              </li>
              <li class="Footer-item">
                <a class="Footer-link" href="https://www.instagram.com/TheGlobalGoals/">
                  <span class="Footer-social" style="background-image:url('/instagram.svg')">Instagram</span>
                </a>
              </li>
              <li class="Footer-item">
                <a class="Footer-link" href="https://www.youtube.com/channel/UCRfuAYy7MesZmgOi1Ezy0ng">
                  <span class="Footer-social" style="background-image:url('/youtube.svg'); background-size: 20px auto">YouTube</span>
                </a>
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
