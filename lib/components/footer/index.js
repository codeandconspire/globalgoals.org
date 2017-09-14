const html = require('choo/html');
const logo = require('../logo');

module.exports = function footer(state) {
  let visible;
  if (typeof window !== 'undefined') {
    visible = true;
  }

  const goals = [];
  for (let i = 0; i < state.goals.total; i += 1) {
    goals.push(i + 1);
  }

  return html`
    <footer class="Footer ${ visible ? 'is-visible' : '' }" role="contentinfo">
      <nav class="View-section">
        <div class="Footer-content">
          <div class="Footer-column Footer-column--goals">
            <h2 class="Footer-title">The Goals</h2>
            <ul class="Footer-list">
              ${ goals.map(goal => html`
                <li class="Footer-item"><a tabindex="-1" class="Footer-link u-bg${ goal }" href="/${ goal }">Goal ${ goal }</a></li>
              `) }
            </ul>
          </div>
          <div class="Footer-column Footer-column--credits Footer-column--full">
            <h2 class="Footer-title">Credits</h2>
            <ul class="Footer-list">
              <li class="Footer-item">
                <a class="Footer-blockLink" href="https://un.org">
                  <div class="Footer-figure">
                    <img class="Footer-figureImg" height="32" src="/un.svg">
                  </div>
                  <div class="Footer-blockLinkTarget">In support of <em class="Footer-name">The United Nations</em></div>
                </a>
              </li>
              <li class="Footer-item">
                <a class="Footer-blockLink" href="https://project-everyone.org">
                  <div class="Footer-figure">
                    <img class="Footer-figureImg" height="27" src="/project-everyone.svg">
                  </div>
                  <div class="Footer-blockLinkTarget">Produced by <em class="Footer-name">Project Everyone</em></div>
                </a>
              </li>
              <li class="Footer-item">
                <a class="Footer-blockLink" href="https://gettyimages.com">
                  <div class="Footer-figure">
                    <img class="Footer-figureImg" height="18" src="/getty-images.svg">
                  </div>
                  <div class="Footer-blockLinkTarget">Visual content partner <em class="Footer-name">Getty Images</em></div>
                </a>
              </li>
              <li class="Footer-item">
                <a class="Footer-blockLink" href="https://thenewdivision.world">
                  <div class="Footer-figure">
                    <img class="Footer-figureImg" height="23" src="/the-new-division.svg">
                  </div>
                  <div class="Footer-blockLinkTarget">Brand design by <em class="Footer-name">The New Division</em></div>
                </a>
              </li>
              <li class="Footer-item">
                <a class="Footer-blockLink" href="http://trollback.com">
                  <div class="Footer-figure">
                    <img class="Footer-figureImg" height="10" src="/trollback.svg">
                  </div>
                  <div class="Footer-blockLinkTarget">Icons and Logotype <em class="Footer-name">Trollbäck+Company</em></div>
                </a>
              </li>
              <li class="Footer-item">
                <a class="Footer-blockLink" href="http://codeandconspire.com">
                  <div class="Footer-figure">
                    <img class="Footer-figureImg" height="19" src="/code-and-conspire.png" style="mix-blend-mode: color;">
                  </div>
                  <div class="Footer-blockLinkTarget">Digital Innovation by <em class="Footer-name">code&conspire</em></div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </footer>
  `;
};
