const html = require('choo/html');
const { asText } = require('prismic-richtext');
const { resolve } = require('../params');
const { __ } = require('../locale');
const view = require('../components/view');

const GOAL_TAG = /^goal-(\d{1,2})$/;

module.exports = view(initiatives, title);

function initiatives(state, emit) {
  const { articles: { isLoading, items }} = state;

  /**
   * Fetch all missing documents
   */

  if (items.length < state.articles.total) {
    emit('articles:fetch');
  }

  return html`
    <main class="View-main">
      <section class="View-section">
        <div class="View-intro">
          <div class="Text">
            <h1>${ __('News') }</h1>
            <p>${ __('Inspiring text about our news related to the The Global Goals.') }</p>
          </div>
        </div>

        ${ isLoading ? html`<em>Loading</em>` : null }

        ${ state.articles.items.map(doc => html`
          <article class="Text">
            ${ asText(doc.data.title) }
            <br />
            <em>${ __('Tags') }: ${ doc.tags.map(tag => tag.match(GOAL_TAG)).filter(Boolean).map(match => match[1]).join(', ') }</em>
            <a href="${ resolve(state.routes.article, { article: doc.uid }) }">
              ${ __('Read more') }
            </a>
          </article>
        `) }
      </section>
    </main>
  `;
}

function title(state) {
  return __('News');
}
