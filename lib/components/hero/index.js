const html = require('choo/html');
const { asText } = require('prismic-richtext');
const asElement = require('prismic-element');
const component = require('fun-component');
const icons = require('../goal/icons');

module.exports = function createHero(name) {
  return component({
    name: `hero:${ name || 'goal' }`,
    // load(element) {
    //   element.querySelector('.js-icon').removeAttribute('style');
    // },
    render(state, goal) {
      const doc = state.goals.items.find(item => item.data.number === goal);
      const classNames = [ 'Hero', `Hero--${ goal }` ];
      const inTransition = state.transitions.includes('takeover');

      if (inTransition) {
        classNames.push('Hero--takeover');
      } else {
        classNames.push(`u-bg${ goal }`);
      }

      return html`
        <section class="${ classNames.join(' ') }">
          <div class="Hero-container">
            <div class="Hero-title js-title">
              ${ icons.label(goal)() }
            </div>

            ${ doc ? html`
              <div class="Hero-intro">
                <div class="Text Text--adaptive">
                  <div class="Text-large">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nec dictum elit. Phasellus nec magna vitae leo tempus consectetur. Integer mattis ut risus eu lobortis. Vivamus dignissim, nisi at tristique consectetur.</p>
                    ${ asElement(doc.data.introduction) }
                  </div>
                </div>
              </div>
            ` : null }
          </div>
        </section>
      `;
    }
  });
};
