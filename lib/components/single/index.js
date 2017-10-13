const html = require('choo/html');
const { asText } = require('prismic-richtext');
const asElement = require('prismic-element');
const { href } = require('../../params');
const { __ } = require('../../locale');

module.exports = function single(state, emit, doc, opts = {}) {
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
          <div class="Grid">
            <div class="Grid-cell Grid-cell--lg2of3">
              <div class="Single-column">
                <div class="Text Text--full Text--growing">
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
            <div class="Grid-cell Grid-cell--lg1of3">
              <div class="Single-column">
                <button class="Button Button--fill Button--justifyLeft" onclick=${ onclick }>
                  <svg viewBox="0 0 12 16" class="Button-icon">
                    <g fill="none" fill-rule="evenodd">
                      <path stroke="#FFF" d="M8 7h3v8H1V7h3m2-6v10"/>
                      <path d="M6 1L3 4m3-3l3 3" stroke="#FFF" stroke-linecap="square"/>
                    </g>
                  </svg>
                  ${ __('Share') }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  `;

  function onclick() {
    const { title, image, introduction } = doc.data;

    emit('ui:share:toggle', {
      href: href(state, doc),
      title: asText(title).trim(),
      image: (image.small && image.small.url) || image.url,
      description: asText(introduction).trim()
    });
  }
};
