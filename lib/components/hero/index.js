const html = require('choo/html');
const asElement = require('prismic-element');
const component = require('fun-component');
const icons = require('../goal/icons');
const { href } = require('../../params');

const BACKGROUNDS = [
  require('./backgrounds/1'),
  null,
  require('./backgrounds/3'),
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  require('./backgrounds/11'),
  null,
  null,
  require('./backgrounds/14'),
  null,
  null,
  null
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
        <section class="${ classNames.join(' ') }">
          <div class="View-animationFriendly">
            <div class="Hero-container">
              <div class="Hero-title js-title">
                ${ icons.label(goal, true) }
              </div>

              ${ doc ? html`
                <div class="Hero-intro">
                  <div class="Text Text--adaptive">
                    <div class="Text-large">
                      ${ asElement(doc.data.introduction, doc => href(state, doc)) }
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
