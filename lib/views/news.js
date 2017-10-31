const html = require('choo/html');
const { asText } = require('prismic-richtext');
const asElement = require('prismic-element');
const { __ } = require('../locale');
const view = require('../components/view');
const card = require('../components/card');
const edit = require('../components/edit');
const slices = require('../components/slices');
const intro = require('../components/intro');
const { inBrowser } = require('../components/base/utils');
const { href, resolve } = require('../params');

const ORIG_PUB_DATE = 'original_publication_date';
const PUB_DATE = 'first_publication_date';

module.exports = view(news, title);

function news(state, emit) {
  const { articles: { isLoading, items, page, pageSize, total }} = state;
  const doc = state.pages.items.find(item => item.uid === 'news');

  if (!state.pages.isLoading && !doc) {
    emit('pages:fetch', { type: 'landing_page', uid: 'news' });
  }

  /**
   * Fetch all missing documents
   */

  const max = Math.ceil(total / pageSize);
  const shouldHave = page === max ? total : page * pageSize;
  if (!isLoading && inBrowser && items.length < shouldHave) {
    emit('articles:fetch');
  }

  /**
   * Sort articles by publication date
   */

  const articles = items.slice().sort((a, b) => {
    const dateA = a.data[ORIG_PUB_DATE] || a[PUB_DATE];
    const dateB = b.data[ORIG_PUB_DATE] || b[PUB_DATE];
    return Date.parse(dateA) > Date.parse(dateB) ? -1 : 1;
  });

  /**
   * Show more articles
   */

  const paginate = page => event => {
    emit('articles:goto', page);
    event.currentTarget.setAttribute('disabled', '');
    event.preventDefault();
  };

  /**
   * Deduct 2 items on all pages but first and last to avoid hermit articles
   */

  const deduct = (page === 1 || page === max) ? 0 : 2;

  function getIntro() {
    if (doc && 'data' in doc) {
      return intro({
        title: asText(doc.data.title),
        body: asElement(doc.data.introduction, doc => href(state, doc)),
        large: true
      });
    } else {
      return intro({ loading: true, large: true });
    }
  }

  return html`
    <main class="View-main u-transformTarget" id="view-main">
      <section class="View-section">
        ${ getIntro() }

        ${ !inBrowser || items.length >= shouldHave ? html`
          <div class="Grid">
            ${ articles.slice(0, 2).map(doc => html`
              <div class="Grid-cell Grid-cell--md1of2 Grid-cell--divideDown">
                ${ card(state, emit, asCard(doc), { date: true, largeText: true }) }
              </div>
            `) }
            ${ articles.slice(2, articles.length - deduct).map((doc, index) => {
              const classNames = [ 'Grid-cell', 'Grid-cell--lg1of3', 'Grid-cell--md1of2' ];

              /**
               * Animate items not part of the first batch (inital page load)
               */

              if ((index + 1) > (pageSize - deduct)) {
                classNames.push('Grid-cell--appear');
              }

              /**
               * Figure out position corrected by page number
               */

              let position = index + 2 - ((page - 1) * pageSize);

              /**
               * Bump the last batch by two to make up for the deduction
               */

              if (page === max) {
                position += 2;
              }

              return html`
                <div class="${ classNames.join(' ') }" style="${ position >= 0 ? `animation-delay: ${ position * 100 }ms;` : '' }">
                  ${ card(state, emit, asCard(doc), { date: true }) }
                </div>
              `;
            }) }
            ${ page < max ? html`
              <div class="Grid-cell Grid-cell--lg1of3 Grid-cell--md1of2 Grid-cell--center">
                <a class="Button Button--fill Button--secondary" role="button" onclick=${ paginate(page + 1) } href="${ resolve(state.routes.news, { referrer: state.params.referrer, query: { page: state.articles.page + 1 } }) }">
                  ${ __('Show more articles') }
                </a>
              </div>
            ` : null }
          </div>
        ` : html`
          <div class="Grid">
            <div class="Grid-cell Grid-cell--md1of2 Grid-cell--divideDown">${ card.loading({ date: true, largeText: true }) }</div>
            <div class="Grid-cell Grid-cell--md1of2 Grid-cell--divideDown">${ card.loading({ date: true, largeText: true }) }</div>
            <div class="Grid-cell Grid-cell--lg1of3 Grid-cell--md1of2">${ card.loading({ date: true }) }</div>
            <div class="Grid-cell Grid-cell--lg1of3 Grid-cell--md1of2">${ card.loading({ date: true }) }</div>
            <div class="Grid-cell Grid-cell--lg1of3 Grid-cell--md1of2">${ card.loading({ date: true }) }</div>
            <div class="Grid-cell Grid-cell--lg1of3 Grid-cell--md1of2">${ card.loading({ date: true }) }</div>
            <div class="Grid-cell Grid-cell--lg1of3 Grid-cell--md1of2">${ card.loading({ date: true }) }</div>
            <div class="Grid-cell Grid-cell--lg1of3 Grid-cell--md1of2">${ card.loading({ date: true }) }</div>
          </div>
        ` }
      </section>

      ${ doc ? slices(state, emit, doc.data.body.map(slice => {
        switch (slice.slice_type) {
          default: return slice;
        }
      })).map(content => html`
        <section class="View-section">
          ${ content }
        </section>
      `) : null }

      ${ edit(state, doc) }
    </main>
  `;

  function asCard(doc) {
    return {
      title: doc.data.title,
      image: doc.data.image,
      body: doc.data.introduction || doc.data.body,
      tags: doc.tags,
      date: doc.data.original_publication_date || doc.first_publication_date,
      href: href(state, doc),
      link: __('Read the full article')
    };
  }
}

function title(state) {
  if (state.pages.isLoading) { return __('LOADING_TEXT_SHORT'); }
  const doc = state.pages.items.find(item => item.uid === 'news');
  return asText(doc.data.title);
}
