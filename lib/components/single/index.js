const url = require('url')
const html = require('choo/html')
const { asText } = require('prismic-richtext')
const asElement = require('prismic-element')
const Component = require('nanocomponent')
const Nanocache = require('../base/utils/cache')
const serialize = require('../text/serialize')
const tags = require('../tags')
const Link = require('../goal-grid/link')
const shareable = require('../shareable')
const { className, image } = require('../base/utils')
const { resolve, href, routes } = require('../../params')
const { __ } = require('../../locale')

var ROOT = process.env.GLOBALGOALS_URL
const TAG_REGEX = /^goal-(\d{1,2})$/

module.exports = class Single extends Component {
  constructor (id, state, emit, opts) {
    super(id)
    this.tagged = []
    this.state = state
    this.emit = emit
    this.cache = new Nanocache(state, emit)
    Object.assign(this, {showDate: false}, opts)
  }

  static identity (doc) {
    return doc.id
  }

  update (doc) {
    const tags = doc.tags
      .map(tag => tag.match(TAG_REGEX))
      .filter(match => match && this.state.goals.items.find(item => {
        return item.data.number === parseInt(match[1], 10)
      }))

    return tags.length !== this.tagged.length
  }

  createElement (doc) {
    const { state, emit, showDate } = this
    const date = new Date(doc.data.original_publication_date || doc.first_publication_date)
    const img = doc.data.image.url ? image(doc.data.image, ['small', 'medium', 'large']) : null
    const tagged = doc.tags
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

    const links = doc.data.links.filter(props => getHref(props.link))

    return html`
      <div class="Single">
        ${img ? html`
          <div class="View-section View-section--fullOnSmall">
            <figure class="Single-banner">
              <img class="Single-bannerFigure" src="${img.src}" alt="${img.alt}" width="${img.width}" height="${img.height}" srcset="${img.srcset}" sizes="${img.sizes}" />
            </figure>
          </div>
        ` : null}

        <div class="View-section">
          <div class="${doc.data.image.url ? '' : 'Space--textBlock Space--textBlockFirst Space--textBlockTopOnly'}">
            <div class="${className('Single-body', { 'Single-body--padd': doc.data.image.url })}">
              <article class="Single-column Single-column--main">
                ${showDate ? html`
                  <time class="Single-date" datetime="${JSON.stringify(date)}">
                    <span class="Text Text--growing Text--muted">
                      ${__('Published on %s %s, %s', __(`MONTH_${date.getMonth()}`), date.getDate(), date.getFullYear())}
                    </span>
                  </time>
                ` : null}

                <div class="Text Text--growing">
                  <h1 class="Text-marginTopNone">${asText(doc.data.title)}</h1>

                  ${doc.data.introduction ? html`
                    <div class="Text-large">
                      ${asElement(doc.data.introduction, href, serialize)}
                    </div>
                  ` : null}
                  ${doc.data.body ? asElement(doc.data.body, href, serialize) : null}
                </div>
              </article>

              <aside class="Single-column Single-column--sidebar">

                ${this.tagged.length ? html`
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

                ${links.length ? html`
                  <div class="Single-block">
                    <div class="Text Text--growing">
                      <h2 class="Text-h4">${__('Find out more')}</h2>
                      <ul class="Text--links">
                        ${links.map(props => {
                          const href = getHref(props.link)

                          if (!href) { return null }

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

                <div class="Single-block Single-block--group">
                  <div class="Single-block">
                    <div class="Text">
                      <h2 class="Text-h4">${__('Spread the word')}</h2>
                    </div>

                    <div class="Single-line">
                      ${shareable({ large: true, onclick: onclick })}
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
              </aside>
            </div>
          </div>
        </div>
      </div>
    `

    function onclick () {
      const { title, image, introduction } = doc.data

      emit('ui:share:toggle', {
        href: href(doc),
        title: asText(title).trim(),
        image: (image.small && image.small.url) || image.url,
        description: asText(introduction).trim()
      })
    }

    function getHref (data) {
      switch (data.link_type) {
        case 'Web': return data.url
        case 'Document': return data.isBroken ? null : href(data)
        case 'Media': return data.url
        default: return null
      }
    }
  }
}
