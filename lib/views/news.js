const html = require('choo/html');
const { asText } = require('prismic-richtext');
const { resolve } = require('../params');
const view = require('../components/view');

const GOAL_TAG = /^goal-(\d{1,2})$/;
const PAGE_SIZE = 6;

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
    <div class="View-section">
      <div class="Text">
        <!-- TODO: Translate -->
        <h1>News</h1>
      </div>
      ${ isLoading ? html`<em>Loading</em>` : null }
      <ul>
        ${ state.articles.items.map(doc => html`
          <li class="Text">
            <a href="${ resolve(state.routes.article, { article: doc.uid }) }">
              ${ asText(doc.data.title) }
              <br />
              <em>Tags: ${ doc.tags.map(tag => tag.match(GOAL_TAG)).filter(Boolean).map(match => match[1]).join(', ') }</em>
            </a>
          </li>
        `) }
    </div>
  `;
}

function title(state) {
  // TODO: Translate
  return 'News';
}
