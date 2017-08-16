const html = require('choo/html');
const { asText } = require('prismic-richtext');
const { resolve } = require('../params');
const { __ } = require('../locale');
const view = require('../components/view');
const header = require('../components/header');
const footer = require('../components/footer');

const GOAL_TAG = /^goal-(\d{1,2})$/;

module.exports = view(initiatives, title);

function initiatives(state, emit) {
  const { initiatives: { isLoading, items, total }} = state;

  /**
   * Fetch all missing documents
   */

  if (items.length !== total) {
    emit('initiatives:fetch');
  }

  return html`
    <div>
      ${ header(state) }
      <main>
        <section class="View-section">
          <div class="View-intro">
            <div class="Text">
              <h1>${ __('Initiatives') }</h1>
              <p>${ __('Inspiring text about The Global Goals initiatives, projects and organisations.') }</p>
            </div>
          </div>

          ${ isLoading ? html`<em>Loading</em>` : null }

          ${ state.initiatives.items.map(doc => html`
            <article class="Text">
              ${ asText(doc.data.title) }
              <br />
              <em>Tags: ${ doc.tags.map(tag => tag.match(GOAL_TAG)).filter(Boolean).map(match => match[1]).join(', ') }</em>
              <a href="${ resolve(state.routes.initiative, { initiative: doc.uid }) }">
                ${ __('View initiative') }
              </a>
            </article>
          `) }
        </section>
      </main>
      ${ footer() }
    </div>
  `;
}

function title(state) {
  return __('Initiatives');
}
