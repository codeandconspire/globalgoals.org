const html = require('choo/html')
const asElement = require('prismic-element')
const { asText } = require('prismic-richtext')
const serialize = require('../components/text/serialize')
const view = require('../components/view')
const card = require('../components/card')
const intro = require('../components/intro')
const slices = require('../components/slices')
const border = require('../components/border')
const edit = require('../components/edit')
const { href } = require('../params')
const { __ } = require('../locale')

module.exports = view('resources', resources, title)

function resources (state, emit) {
  const doc = state.pages.items.find(item => item.type === 'resources')

  if (!doc && !state.pages.isLoading) {
    emit('pages:fetch', { single: 'resources' })
  }

  /**
   * Map categories to anchor links
   */

  const quicklinks = doc && doc.data.body
    .filter(slice => slice.slice_type === 'category')
    .map(slice => html`
      <a href="#${urlFriendly(slice.primary.heading)}">
        ${asText(slice.primary.heading)}
      </a>
    `)
    .reduce((list, link) => list.concat(', ', link), [])
    .slice(1)

  function getIntro () {
    if (doc && 'data' in doc) {
      return intro({
        title: asText(doc.data.title),
        body: html`
          <div class="Text-lastMarginNone">
            ${asElement(doc.data.introduction, href, serialize)}
            <p>${__('Quick links')}: ${quicklinks}.</p>
          </div>
        `,
        pageIntro: true
      })
    } else {
      return intro({ loading: true, pageIntro: true })
    }
  }

  return html`
    <main class="View-main u-transformTarget" id="view-main">
      <section class="View-section">
        ${getIntro()}
      </section>

      ${doc ? slices(state, emit, doc.data.body.map((slice, index) => {
        switch (slice.slice_type) {
          case 'category': return html`
            <div id="${urlFriendly(slice.primary.heading)}">
              ${border(asText(slice.primary.heading), index === 0)}
              <div class="Grid">
                ${slice.items.map(item => html`
                  <div class="Grid-cell Grid-cell--md1of2 Grid-cell--lg1of3">
                    ${card(state, emit, resource(item))}
                  </div>
                `)}
              </div>
            </div>
          `
          default: return slice
        }
      })).map(content => html`
        <section class="View-section">
          ${content}
        </section>
      `) : html`
        <section class="View-section">
          <div class="Border Border--first is-loading">
            <span class="Border-text">${__('LOADING_TEXT_SHORT')}</span>
          </div>
          <div class="Grid">
            ${Array.from('123').map(() => html`
              <div class="Grid-cell Grid-cell--md1of2 Grid-cell--lg1of3">
                ${card.loading()}
              </div>
            `)}
          </div>
        </section>
      `}

      ${edit(state, doc)}
    </main>
  `
}

function resource (item) {
  return {
    title: item.name,
    image: item.thumbnail,
    body: item.description,
    file: item.file.url,
    sizes: ['small', 'medium'],
    link: linkText(item.file.url)
  }
}

function linkText (url) {
  if (!url) {
    return
  }

  const filetype = url.match(/[^.]+$/)

  if (!filetype) { return __('Download file') }

  switch (filetype[0]) {
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'tiff':
    case 'bmp':
    case 'svg':
    case 'webp': return __('Download image')
    case 'tar':
    case 'zip': return __('Download zip')
    case 'pdf': return __('Download pdf')
    default: return __('Download file')
  }
}

function urlFriendly (field) {
  return asText(field)
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim()
}

function title (state) {
  const doc = state.pages.items.find(item => item.type === 'resources')

  if (!doc) { return __('LOADING_TEXT_SHORT') }

  return asText(doc.data.title)
}
