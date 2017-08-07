const html = require('choo/html');
const view = require('../components/view');

module.exports = view(goal, title);

function goal(state, emit) {
  return html`
    <div>
      <h1 class="View-title">${ state.params.goal } ${ getName(state.params.slug) }</h1>
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
