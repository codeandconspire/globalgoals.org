const html = require('choo/html');
const { asText } = require('prismic-richtext');
const asElement = require('prismic-element');
const component = require('fun-component');
const icons = require('../goal/icons');

module.exports = component({
  name: 'goal-hero',
  // load(element) {
  //   element.querySelector('.js-icon').removeAttribute('style');
  // },
  render(state, goal) {
    const doc = state.goals.items.find(item => item.data.number === goal);
    const classNames = [ 'GoalHero', `GoalHero--${ goal }` ];
    const inTransition = state.transitions.includes('takeover');

    if (inTransition) {
      classNames.push('GoalHero--takeover');
    }

    return html`
      <section class="${ classNames.join(' ') }">
        <div class="GoalHero-container">
          <div class="GoalHero-icon js-title">
            ${ icons.label(goal)() }
          </div>

          ${ doc ? html`
            <div class="GoalHero-intro">
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
