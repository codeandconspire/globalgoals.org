const html = require('choo/html');
const view = require('../components/view');
const { icons, texts } = require('../components/goals');

module.exports = view(goal, title);

function goal(state, emit) {
  const num = state.params.goal - 1;

  return html`
    <div>
      <h1 class="View-title">${ texts[num].title }</h1>
      ${ icons[num]() }
      ${ state.params.referrer ? html`
        <p>
          Referrer id: ${ state.params.referrer }
        </p>
      ` : null }
    </div>
  `;
}

function title(state) {
  return `${ state.params.goal } ${ getName(state.params.slug) } | The Global Goals`;
}

function getName(slug) {
  return slug
    .split('-')
    .map(str => str[0].toUpperCase() + str.substr(1))
    .join(' ');
}
