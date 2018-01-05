const html = require('choo/html')
const { asText } = require('prismic-richtext')
const asElement = require('prismic-element')
const serialize = require('../components/text/serialize')
const view = require('../components/view')
const card = require('../components/card')
const edit = require('../components/edit')
const Slices = require('../components/slices')
const intro = require('../components/intro')
const { href, routes } = require('../params')
const { __ } = require('../locale')

module.exports = view('news', news, title)

function news (state, emit, render) {
  const articles = state.articles
  const page = state.query.page ? +state.query.page : state.articles.page
  const doc = state.pages.items.find(item => item.uid === 'news')

  if (!state.pages.isLoading && !doc) {
    emit('pages:fetch', { type: 'landing_page', uid: 'news' })
  }

  /**
   * Fetch missing documents
   */

  const hasAllPages = articles.pages.length >= page
  if (!articles.isLoading && !hasAllPages) {
    emit('articles:fetch')
  }

  /**
   * Show more articles
   */

  const paginate = page => event => {
    emit('articles:paginate', page)
    event.currentTarget.setAttribute('disabled', '')
    event.preventDefault()
  }

  // Get list of all article ids in order by page
  const ids = articles.pages.slice(0, page).reduce((all, page) => {
    return all.concat(page)
  }, [])

  // Figure out how many pages there are in total
  const max = articles.total && Math.ceil(articles.total / articles.pageSize)

  // Figure out how many articles to deduct to avoid orphan grid cells
  const deduct = page === max ? 0 : (ids.length - 2) % 3

  return html`
    <main class="View-main u-transformTarget" id="view-main">
      <section class="View-section">
        ${getIntro()}

        ${!articles.isLoading && hasAllPages ? html`
          <div class="Grid">
            ${ids.slice(0, 2).map(byId).map(doc => html`
              <div class="Grid-cell Grid-cell--md1of2 Grid-cell--divideDown">
                ${card(state, emit, asCard(doc), { date: true, largeText: true })}
              </div>
            `)}
            ${ids.slice(2, ids.length - deduct).map(byId).map((doc, index, list) => {
              const classNames = [ 'Grid-cell', 'Grid-cell--lg1of3', 'Grid-cell--md1of2' ]

              /**
               * Animate items not part of the first batch (inital page load)
               */

              if ((index + 1) > (articles.pageSize - deduct)) {
                classNames.push('Grid-cell--appear')
              }

              /**
               * Figure out position corrected by page number
               */

              let position = index - (list.length - articles.pageSize)

              return html`
                <div class="${classNames.join(' ')}" style="${position >= 0 ? `animation-delay: ${position * 100}ms;` : ''}">
                  ${card(state, emit, asCard(doc), { date: true })}
                </div>
              `
            })}
            ${articles.total && (page * articles.pageSize) < articles.total ? html`
              <div class="Grid-cell Grid-cell--lg1of3 Grid-cell--md1of2 Grid-cell--center">
                <a class="Button Button--fill Button--secondary" role="button" onclick=${paginate(page + 1)} href="${routes.news}?page=${page + 1}">
                  ${__('Show more articles')}
                </a>
              </div>
            ` : null}
          </div>
        ` : html`
          <div class="Grid">
            <div class="Grid-cell Grid-cell--md1of2 Grid-cell--divideDown">${card.loading({ date: true, largeText: true })}</div>
            <div class="Grid-cell Grid-cell--md1of2 Grid-cell--divideDown">${card.loading({ date: true, largeText: true })}</div>
            <div class="Grid-cell Grid-cell--lg1of3 Grid-cell--md1of2">${card.loading({ date: true })}</div>
            <div class="Grid-cell Grid-cell--lg1of3 Grid-cell--md1of2">${card.loading({ date: true })}</div>
            <div class="Grid-cell Grid-cell--lg1of3 Grid-cell--md1of2">${card.loading({ date: true })}</div>
            <div class="Grid-cell Grid-cell--lg1of3 Grid-cell--md1of2">${card.loading({ date: true })}</div>
            <div class="Grid-cell Grid-cell--lg1of3 Grid-cell--md1of2">${card.loading({ date: true })}</div>
            <div class="Grid-cell Grid-cell--lg1of3 Grid-cell--md1of2">${card.loading({ date: true })}</div>
          </div>
        `}
      </section>

      ${doc ? render(Slices, doc.id, doc.data.body, content => html`
        <section class="View-section">
          ${content}
        </section>
      `) : null}

      ${edit(state, doc)}
    </main>
  `

  function byId (id) {
    return articles.items.find(item => item.id === id)
  }

  function getIntro () {
    if (doc && 'data' in doc) {
      return intro({
        title: asText(doc.data.title),
        body: asElement(doc.data.introduction, href, serialize),
        pageIntro: true
      })
    } else {
      return intro({ loading: true, pageIntro: true })
    }
  }

  function asCard (doc) {
    return {
      title: doc.data.title,
      image: doc.data.image,
      body: doc.data.introduction || doc.data.body,
      tags: doc.tags,
      date: doc.data.original_publication_date || doc.first_publication_date,
      href: href(doc),
      sizes: ['small', 'medium'],
      link: __('Read more')
    }
  }
}

function title (state) {
  if (state.pages.isLoading) { return __('LOADING_TEXT_SHORT') }
  const doc = state.pages.items.find(item => item.uid === 'news')
  return asText(doc.data.title)
}
