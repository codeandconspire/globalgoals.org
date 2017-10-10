const html = require('choo/html');
const asElement = require('prismic-element');
const { asText } = require('prismic-richtext');
const view = require('../components/view');
const card = require('../components/card');
const intro = require('../components/intro');
const slices = require('../components/slices');
const border = require('../components/border');
const edit = require('../components/edit');
const { href } = require('../params');
const { __ } = require('../locale');

module.exports = view(resources, title);

function resources(state, emit) {
  const doc = state.pages.items.find(item => item.type === 'resources');

  if (!doc && !state.pages.isLoading) {
    emit('pages:fetch', { single: 'resources' });
  }

  /**
   * Map categories to anchor links
   */

  const quicklinks = doc && doc.data.body
    .filter(slice => slice.slice_type === 'category')
    .map(slice => html`
      <a href="#${ urlFriendly(slice.primary.heading) }">
        ${ asText(slice.primary.heading) }
      </a>
    `)
    .reduce((list, link) => list.concat(link, ', '), []);

  /**
   * Remove trailing comma
   */

  quicklinks.pop();

  return html`
    <main class="View-main u-transformTarget" id="view-main">
      <section class="View-section">
        ${ doc ? intro({
          title: asText(doc.data.title),
          body: [
            asElement(doc.data.introduction, doc => href(state, doc)),
            html`<p>${ __('Quick links') }: ${ quicklinks }</p>`
          ]
        }) : intro() }
      </section>

      ${ doc ? slices(state, emit, doc.data.body.map(slice => {
        switch (slice.slice_type) {
          case 'category': return html`
            <div id="${ urlFriendly(slice.primary.heading) }">
              ${ border(asText(slice.primary.heading)) }
              <div class="Grid">
                ${ slice.items.map(item => html`
                  <div class="Grid-cell Grid-cell--md1of2 Grid-cell--lg1of3">
                    ${ card(state, emit, resource(item)) }
                  </div>
                `) }
              </div>
            </div>
          `;
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
}

function resource(item) {
  return {
    title: item.name,
    image: item.thumbnail,
    body: item.description,
    file: item.file.url,
    sizes: ['small', 'medium'],
    link: linkText(item.file.url)
  };
}

function linkText(url) {
  const filetype = url.match(/[^.]+$/);

  if (!filetype) { return __('Download file'); }

  switch (filetype[0]) {
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'tiff':
    case 'bmp':
    case 'svg':
    case 'webm': return __('Download image');
    case 'tar':
    case 'zip':
    case 'zipx': return __('Download zip');
    default: return __('Download file');
  }
}

function urlFriendly(field) {
  return asText(field)
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim();
}

function title(state) {
  const doc = state.pages.items.find(item => item.type === 'resources');

  if (!doc) { return __('LOADING_TEXT_SHORT'); }

  return asText(doc.data.title);
}
