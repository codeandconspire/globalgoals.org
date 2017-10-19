const html = require('choo/html');
const { asText } = require('prismic-richtext');
const asElement = require('prismic-element');
const { href } = require('../params');
const { __ } = require('../locale');
const view = require('../components/view');
const edit = require('../components/edit');
const card = require('../components/card');
const intro = require('../components/intro');

module.exports = view(activities, title);

function activities(state, emit) {
  const { activities: { isLoading, items, total }} = state;
  const doc = state.pages.items.find(item => item.uid === 'activities');

  /**
   * Fetch any missing documents
   */

  if (!state.pages.isLoading && !doc) {
    emit('pages:fetch', { type: 'landing_page', uid: 'activities' });
  }

  if (!isLoading && items.length !== total) {
    emit('activities:fetch');
  }

  return html`
    <main class="View-main u-transformTarget" id="view-main">
      <section class="View-section">
        ${ (doc) && 'data' in doc ? intro({title: asText(doc.data.title), body: asElement(doc.data.introduction, doc => href(state, doc)) }) : intro() }

        ${ !isLoading && items.length === total ? html`
          <div class="Grid">
            <div class="Grid-cell">
              ${ card(state, emit, asCard(state.activities.items[0]), {
                horizontal: true,
                fill: state.activities.items[0].data.color || true,
                largeText: true
              }) }
            </div>
            ${ state.activities.items.slice(1).map(doc => html`
              <div class="Grid-cell Grid-cell--lg1of3 Grid-cell--md1of2">
                ${ card(state, emit, asCard(doc), { fill: doc.data.color || true }) }
              </div>
            `) }
          </div>
        ` : html`
          <div class="Grid">
            <div class="Grid-cell">${ card.loading({ fill: true, horizontal: true, largeText: true }) }</div>
            <div class="Grid-cell Grid-cell--lg1of3 Grid-cell--md1of2">${ card.loading({ fill: true }) }</div>
            <div class="Grid-cell Grid-cell--lg1of3 Grid-cell--md1of2">${ card.loading({ fill: true }) }</div>
            <div class="Grid-cell Grid-cell--lg1of3 Grid-cell--md1of2">${ card.loading({ fill: true }) }</div>
            <div class="Grid-cell Grid-cell--lg1of3 Grid-cell--md1of2">${ card.loading({ fill: true }) }</div>
            <div class="Grid-cell Grid-cell--lg1of3 Grid-cell--md1of2">${ card.loading({ fill: true }) }</div>
            <div class="Grid-cell Grid-cell--lg1of3 Grid-cell--md1of2">${ card.loading({ fill: true }) }</div>
          </div>
        ` }
      </section>

      ${ edit(state, doc) }
    </main>
  `;

  function asCard(doc) {
    let url;

    if (doc.data.redirect.link_type === 'Document') {
      url = href(state, doc.data.redirect);
    } else if (doc.data.redirect.link_type === 'Web') {
      url = doc.data.redirect.url;
    } else if (doc.data.redirect.link_type === 'Media') {
      url = doc.data.redirect.url;
    } else {
      url = href(state, doc);
    }

    return {
      title: doc.data.title,
      image: doc.data.image,
      body: doc.data.introduction || doc.data.body,
      tags: doc.tags,
      href: url,
      link: __('View campaign')
    };
  }
}

function title(state) {
  if (state.pages.isLoading) { return __('LOADING_TEXT_SHORT'); }
  const doc = state.pages.items.find(item => item.uid === 'activities');
  return asText(doc.data.title);
}
