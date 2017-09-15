const html = require('choo/html');
const asElement = require('prismic-element');
const component = require('fun-component');
const { label } = require('../icon');
const { __ } = require('../../locale');
const { href } = require('../../params');

const BACKGROUNDS = [
  require('./backgrounds/1'),
  require('./backgrounds/2'),
  require('./backgrounds/3'),
  require('./backgrounds/4'),
  require('./backgrounds/5'),
  require('./backgrounds/6'),
  require('./backgrounds/7'),
  require('./backgrounds/8'),
  require('./backgrounds/9'),
  require('./backgrounds/10'),
  require('./backgrounds/11'),
  require('./backgrounds/12'),
  require('./backgrounds/13'),
  require('./backgrounds/14'),
  require('./backgrounds/15'),
  null,
  require('./backgrounds/17')
];

module.exports = function createHero(name) {
  return component({
    name: `hero:${ name || 'goal' }`,
    render(state, goal, withBackground = true) {
      const doc = state.goals.items.find(item => item.data.number === goal);
      const classNames = [ 'Hero', `Hero--${ goal }` ];
      const inTransition = state.transitions.includes('takeover');
      const background = withBackground && BACKGROUNDS[goal - 1];

      if (inTransition) {
        classNames.push('Hero--takeover');
      } else {
        classNames.push(`u-bg${ goal }`);
      }

      return html`
        <section class="${ classNames.join(' ') }" id="hero">
          <div class="View-animationFriendly" id="hero-content">
            <div class="Hero-container">
              <div class="Hero-title js-title">
                ${ label(goal, 'Hero') }
              </div>

              ${ doc ? html`
                <div class="Hero-intro">
                  <div class="Text Text--adaptive Text--growing">
                    ${ asElement(doc.data.introduction, doc => href(state, doc)) }
                  </div>
                  <div class="Hero-link">
                    <div class="Text Text--adaptive">
                      <a href="#targets">
                        ${ __('Explore the Targets') }
                        <svg class="Text-icon" width="20" height="20" viewBox="0 0 20 20">
                          <g transform="rotate(90 10 10)" fill="none" fill-rule="evenodd">
                            <path d="M11.52 10L8 13.52l.73.73L12.98 10 8.73 5.75 8 6.48 11.52 10z" fill="currentColor" />
                            <circle stroke="currentColor" cx="10" cy="10" r="9.5" />
                          </g>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ` : null }

              </div>
            </div>
          ${ background ? background() : null }
        </section>
      `;
    }
  });
};
