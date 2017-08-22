const html = require('choo/html');
const { asText } = require('prismic-richtext');
const asElement = require('prismic-element');
const { __ } = require('../locale');
const view = require('../components/view');
const { href } = require('../params');

module.exports = view(page, title);

function page(state, emit) {
  const doc = state.pages.items.find(item => item.uid === state.params.page);

  if (!doc) {
    emit('pages:fetch', { type: 'page', uid: state.params.page });
    return html`<em>Loading</em>`;
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
    </main>
  `;
}

function title(state) {
  if (state.pages.isLoading) { return html`<span class="u-textLoading">${ __('Loading') }</span>`; }

  const doc = state.pages.items.find(item => item.uid === state.params.page);

  return asText(doc.data.title);
}
