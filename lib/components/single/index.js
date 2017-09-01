const html = require('choo/html');
const { asText } = require('prismic-richtext');
const asElement = require('prismic-element');
const { href } = require('../../params');
const { __ } = require('../../locale');

const GOAL_TAG = /^goal-(\d{1,2})$/;

module.exports = function single(state, emit, doc, opts = {}) {
  const tags = doc.tags.filter(tag => GOAL_TAG.test(tag));
  const date = new Date(doc.data.original_publication_date || doc.first_publication_date);

  return html`
    <article class="Single">
      ${ doc.data.image.url ? html`
        <div class="View-section View-section--fullOnSmall">
          <figure class="Single-banner">
            <img class="Single-bannerFigure" src="${ doc.data.image.url }" alt="${ doc.data.image.alt }" width="${ doc.data.image.dimensions.width }" height="${ doc.data.image.dimensions.height }" />
          </figure>
        </div>
      ` : null }

      <div class="View-section">
        <div class="Single-body ${ doc.data.image.url ? 'Single-body--pullUp' : '' }">
          <div class="Text Text--growing">
            ${ opts.showDate ? html`
              <time class="Single-date" datetime="${ JSON.stringify(date) }">
                ${ __('Published on %s %s, %s', __(`MONTH_${ date.getMonth() }`), date.getDate(), date.getFullYear()) }
              </time>
            ` : null }

            <h1 class="Text-marginTopNone">${ asText(doc.data.title) }</h1>
            ${ doc.data.introduction ? html`
              <div class="Text-large">
                ${ asElement(doc.data.introduction, doc => href(state, doc)) }
              </div>
            ` : null }
            ${ doc.data.body ? asElement(doc.data.body, doc => href(state, doc)) : null }
          </div>
        </div>
      </div>
    </article>
  `;
};
