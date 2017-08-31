const html = require('choo/html');
const { asText } = require('prismic-richtext');
const asElement = require('prismic-element');
const { resolve } = require('../params');
const { __ } = require('../locale');
const view = require('../components/view');
const single = require('../components/single');
const edit = require('../components/edit');
const { href } = require('../params');

const GOAL_TAG = /^goal-(\d{1,2})$/;

module.exports = view(article, title);

function article(state, emit) {
  const { articles, goals, params } = state;
  const doc = articles.items.find(doc => doc.uid === params.article);

  /**
   * Fetch missing document
   */

  if (!doc) {
    emit('articles:fetch', params.article);
    return html`
      <main class="View-main">
        <div class="View-section">
          ${ intro() }
        </div>
      </main>
    `;
  }

  /**
   * Single out goal number from document tags
   */

  const numbers = doc.tags
    .map(tag => tag.match(GOAL_TAG))
    .filter(Boolean)
    .map(match => +match[1]);

  /**
   * Find all tagged documents
   */

  const docs = numbers
    .map(num => goals.items.find(goal => goal.data.number === num))
    .filter(Boolean);

  /**
   * Identify missing documents
   */

  const missing = numbers.filter(num => !docs.find(doc => doc.data.number === num));
  if (missing.length) {
    emit('goals:fetch', missing);
  }

  return html`
    <main class="View-main">
      ${ single(state, emit, doc, {showDate: true}) }

      <section class="View-section">
        ${ numbers.length ? html`
          <div class="Text">
            <h1>${ __('Related goals') }</h1>
            <ul>
              ${ docs.map(doc => html`
                <li>
                  <a href="${ resolve(state.routes.goal, { goal: doc.data.number, slug: doc.uid, referrer: state.params.referrer }) }">
                    ${ doc.data.number } ${ asText(doc.data.title) }
                  </a>
                </li>
              `) }
            </ul>
          </div>
        ` : null }
      </section>

      ${ edit(doc.id) }
    </main>
  `;
}

function title(state) {
  if (state.articles.isLoading) { return html`<span class="u-loading">${ __('LOADING_TEXT_SHORT') }</span>`; }

  const { articles, params } = state;
  const doc = articles.items.find(doc => doc.uid === params.article);

  return asText(doc.data.title);
}
