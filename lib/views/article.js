const html = require('choo/html');
const { asText } = require('prismic-richtext');
const asElement = require('prismic-element');
const { resolve } = require('../params');
const { __ } = require('../locale');
const view = require('../components/view');
const { href } = require('../params');

const GOAL_TAG = /^goal-(\d{1,2})$/;

module.exports = view(initiative, title);

function initiative(state, emit) {
  const { articles, goals, params } = state;
  const doc = articles.items.find(doc => doc.uid === params.article);

  /**
   * Fetch missing document
   */

  if (!doc) {
    emit('articles:fetch', params.article);
    return html`<span class="u-textLoading">${ __('Loading') }</span>`;
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
      <article class="View-section">
        <div class="View-article">
          <div class="Text">
            ${ doc.data.image.url ? html`
              <figure>
                <img src="${ doc.data.image.url }" alt="${ doc.data.image.alt }" width="${ doc.data.image.dimensions.width }" height="${ doc.data.image.dimensions.height }" />
                <figcaption>${ doc.data.image.alt }</figcaption>
              </figure>
            ` : null }
            <h1>${ asText(doc.data.title) }</h1>
            ${ doc.data.introduction ? html`
              <div class="Text-large">
                ${ asElement(doc.data.introduction, doc => href(state, doc)) }
              </div>
            ` : null }
            ${ doc.data.body ? asElement(doc.data.body, doc => href(state, doc)) : null }
          </div>
        </div>
      </article>

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
    </main>
  `;
}

function title(state) {
  if (state.articles.isLoading) { return html`<span class="u-textLoading">${ __('Loading') }</span>`; }

  const { articles, params } = state;
  const doc = articles.items.find(doc => doc.uid === params.article);

  return asText(doc.data.title);
}
