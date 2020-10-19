const url = require('url')
const html = require('choo/html')
const { asText } = require('prismic-richtext')
const asElement = require('prismic-element')
const Component = require('nanocomponent')
const Nanocache = require('../base/utils/cache')
const serialize = require('../text/serialize')
const tags = require('../tags')
const Link = require('../goal-grid/link')
const Tablist = require('../tablist')
const shareable = require('../shareable')
const { className, image } = require('../base/utils')
const { resolve, href, routes } = require('../../params')
const { __ } = require('../../locale')

var ROOT = process.env.GLOBALGOALS_URL
const TAG_REGEX = /^goal-(\d{1,2})$/

module.exports = class Single extends Component {
  constructor (id, state, emit, doc, opts) {
    super(id)
    this.tagged = []
    this.state = state
    this.emit = emit
    this.cache = new Nanocache(state, emit)
    Object.assign(this, {
      parent: null,
      showDate: false,
      isLoading: false
    }, opts)
  }

  static identity (doc, opts) {
    return `single-${(opts && opts.key) || doc.id}`
  }

  update (doc, opts) {
    if (doc && doc.uid !== this.uid) return true
    if (opts && (opts.isLoading !== this.isLoading)) return true

    const tags = doc.tags
      .map(tag => tag.match(TAG_REGEX))
      .filter(match => match && this.state.goals.items.find(item => {
        return item.data.number === parseInt(match[1], 10)
      }))

    return tags.length !== this.tagged.length
  }

  createElement (doc, opts) {
    const uid = this.uid = doc ? doc.uid : null
    const isLoading = this.isLoading = (opts && opts.isLoading)
    const { state, emit, showDate } = this
    const parent = this.parent || doc
    const links = doc ? doc.data.links.filter(item => {
      // Filter out empty and broken document links
      if (item.link.link_type === 'Document') return !item.link.isBroken
      return item.link.url
    }) : []

    let date = null
    if (doc && doc.data.original_publication_date) {
      date = new Date(doc.data.original_publication_date)
    } else if (doc) {
      date = new Date(doc.first_publication_date)
    }

    let img
    if (doc && doc.data.image.url) {
      img = image(doc.data.image, ['small', 'medium', 'large'])
    } else if (parent && parent.data.image.url) {
      img = image(parent.data.image, ['small', 'medium', 'large'])
    }

    let tagged = []
    if (doc) {
      tagged = doc.tags
        .map(tag => tag.match(TAG_REGEX))
        .filter(Boolean)
        .map(match => parseInt(match[1], 10))

      if (!doc.tags.includes('organisation') && !state.goals.error) {
        this.tagged = tagged.map(tag => {
          const goal = state.goals.items.find(item => item.data.number === tag)
          if (!goal) emit('goals:fetch', { number: tag, critical: false })
          return goal
        }).filter(Boolean)
      }
    }

    const tabs = []
    if (parent && parent.data.menu && parent.data.menu.find(item => item.link.uid)) {
      tabs.push({
        id: parent.uid,
        label: parent.data.label || asText(parent.data.title),
        href: resolve(routes.page, parent)
      }, ...parent.data.menu.filter(item => item.link.uid).map(item => ({
        id: item.link.uid,
        label: item.label,
        href: resolve(routes.sub_page, {parent: parent, child: item.link})
      })))
    }

    const onselect = id => {
      const parent = this.parent || doc
      const isParent = id === parent.uid
      const route = isParent ? routes.page : routes.sub_page
      emit(state.events.PUSHSTATE, resolve(route, isParent ? parent : {
        parent: parent,
        child: parent.data.menu.find(item => item.link.uid === id).link
      }))
    }

    return html`
      <div class="Single">
        ${img ? html`
          <div class="View-section View-section--fullOnSmall" id="${this._name}-img">
            <figure class="Single-banner">
              <img class="Single-bannerFigure" alt="${img.alt}" width="${img.width}" height="${img.height}" srcset="${img.srcset}" sizes="${img.sizes}" src="${img.src}">
            </figure>
          </div>
        ` : null}

        <div class="View-section" id="${this._name}-body">
          <div class="${img ? '' : 'Space--textBlock Space--textBlockFirst Space--textBlockTopOnly'}">
            ${tabs.length ? html`
              <div class="Space Space--endShort Space--startShort">
                ${this.cache.render(Tablist, tabs, onselect, { selected: uid, color: parent && parent.data.color })}
              </div>
            ` : null}
            <div class="${className('Single-body', { 'Single-body--padd': img })}" id="${doc ? (doc.uid + '-thing') : ''}">
              <article class="Single-column Single-column--main">
                ${showDate && date ? html`
                  <time class="Single-date" datetime="${formatDate(date)}">
                    <span class="Text Text--growing Text--muted">
                      ${__('Published on %s %s, %s', __(`MONTH_${date.getMonth()}`), date.getDate(), date.getFullYear())}
                    </span>
                  </time>
                ` : null}

                <div class="Text Text--growing">
                  <h1 class="${className('Text-marginTopNone', {'u-loading': isLoading})}">${isLoading ? __('LOADING_TEXT_SHORT') : asText(doc.data.title)}</h1>
                  <div class="Text-large">
                    ${isLoading ? html`<p class="u-loading">${__('LOADING_TEXT_LONG')}</p>` : null}
                    ${!isLoading && doc && doc.data.introduction ? asElement(doc.data.introduction, href, serialize) : null}
                  </div>
                  ${!isLoading && doc && doc.data.body ? asElement(doc.data.body, href, serialize) : null}
                </div>
              </article>

              <aside class="Single-column Single-column--sidebar">

                ${!isLoading && doc && this.tagged.length ? html`
                  <div class="Single-block Single-block--inset">
                    <div class="${className('Single-tags', { 'Single-tags--single': this.tagged.length === 1 })}">
                      ${this.tagged.length === 1 ? html`
                        <div class="GoalGrid GoalGrid--simple">
                          ${this.tagged.map(item => this.cache.render(Link, item.data.number, item))}
                        </div>
                      ` : tags(this.tagged.map(item => ({
                        href: item.id ? href(item) : resolve(routes.goal, {data: {number: item}}),
                        number: item.id ? item.data.number : item
                      })))}
                    </div>

                    <div class="Text">
                      <small class="Text-muted">
                        <strong>${asText(doc.data.title)}</strong>
                        ${' ' + __('is associated with')}
                        ${this.tagged.map(item => {
                          return html`<span>${__('Goal %s', item.data.number)} – ${asText(item.data.title)}</span>`
                        }).reduce((text, title, index, list) => {
                          const offset = list.length - 1 - index
                          return text.concat(title, (offset ? (offset === 1 ? ' and ' : ', ') : ''))
                        }, [])}
                      </small>
                    </div>

                  </div>
                ` : null}

                ${!isLoading && links.length ? html`
                  <div class="Single-block u-printHidden">
                    <div class="Text Text--growing">
                      <h2 class="Text-h4">${__('Find out more')}</h2>
                      <ul class="Text--links">
                        ${links.map(props => {
                          const href = getHref(props.link)

                          if (!href) return null
                          return html`
                            <li>
                              <a href="${href}">${props.text}</a>
                            </li>
                          `
                        })}
                      </ul>
                    </div>
                  </div>
                ` : null}

                ${doc && !isLoading ? html`
                  <div class="Single-block Single-block--group u-printHidden">
                    <div class="Single-block">
                      <div class="Text">
                        <h2 class="Text-h4">${__('Spread the word')}</h2>
                      </div>

                      <div class="Single-line">
                        ${shareable({ large: true, onclick: onshareclick })}
                      </div>
                      <div class="Single-line">
                        ${shareable({
                          large: true,
                          email: true,
                          href: `mailto:?subject=${asText(doc.data.title).trim()}&body=${asText(doc.data.introduction).trim()} ${url.resolve(ROOT, href(doc)).replace(/\/$/, '')}`
                        })}
                      </div>
                    </div>
                  </div>
                ` : null}
              </aside>
            </div>
          </div>
        </div>
      </div>
    `

    function onshareclick () {
      const { title, image, introduction } = doc.data

      emit('ui:share:toggle', {
        href: href(doc),
        title: asText(title).trim(),
        image: (image.small && image.small.url) || image.url,
        description: asText(introduction).trim()
      })
    }
  }
}

function getHref (data) {
  switch (data.link_type) {
    case 'Web': return data.url
    case 'Document': return data.isBroken ? null : href(data)
    case 'Media': return data.url
    default: return null
  }
}

function formatDate (date) {
  return JSON.stringify(date).replace(/"/g, '')
}
