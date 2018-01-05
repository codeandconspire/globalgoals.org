const html = require('choo/html')
const { asText } = require('prismic-richtext')
const Component = require('nanocomponent')
const { image } = require('../base/utils')
const shareable = require('../shareable')
const { resolve, routes } = require('../../params')
const { __ } = require('../../locale')

module.exports = class Messages extends Component {
  constructor (id, state, emit) {
    super(id)
    this.state = state
    this.emit = emit
  }

  static title () {
    return __('Spread the word')
  }

  static href (doc) {
    return resolve(routes[doc.type === 'goal' ? 'goal_media' : 'all_media'], doc)
  }

  static identity (doc) {
    return `engager-${doc.id}-messages`
  }

  update () {
    return false
  }

  createElement (doc) {
    // Make sure to only show media with an url (for permalinking)
    const include = media => media.link.url || media.slug
    const format = media => {
      // Respect media hard link before resolving to media page
      let href = media.link.url || resolve(routes.media, {doc, media})
      // Fallback to goal page
      if (!href) href = resolve(routes.goal, doc)

      // Construct unique id based on slug or link path
      const slug = media.slug || (media.link && media.link.url.replace(/[^\w]/g, '-'))
      const id = Messages.identity(doc) + '-' + slug

      return {
        id: id,
        href: href,
        media: media,
        onclick: event => {
          if (media.link.url) {
            window.location.assign(href)
          } else {
            this.emit('ui:share:toggle', {
              href: href,
              title: asText(media.title).trim(),
              image: getActiveImageSrc(document.querySelector(`#${id} .js-image`)),
              asset: media.link.url || media.image.url,
              description: asText(media.description).trim()
            })
          }

          event.preventDefault()
        }
      }
    }

    let media
    if (doc.type === 'goal') {
      media = doc.data.media.filter(include).map(format)
    } else {
      media = this.state.goals.items
        .filter(goal => goal.data.media.length)
        .map(goal => {
          const media = goal.data.media.filter(include)
          return format(media[Math.floor(Math.random() * media.length)])
        })
    }

    return html`
      <div class="Grid Grid--masonry Grid--sm2col Grid--md3col">
        ${media.map((props, index) => html`
          <div class="Grid-cell" id="${doc.id}-media-${index}">
            ${poster(props)}
          </div>
        `)}
      </div>
    `
  }
}

function poster ({media, onclick, href, id}) {
  const img = image(media.image, [ 'small', 'medium' ])

  return html`
    <article class="Engager-poster Shareable" id="${id}" onclick=${onclick}>
      ${media.image.url ? html`
        <figure class="Engager-imageWrapper" style="padding-top: ${img.height / img.width * 100}%">
          <img class="Engager-image js-image" src="${img.src}" alt="${media.image.alt || ''}" srcset="${img.srcset}" sizes="${img.sizes}" />
          <figcaption class="u-hiddenVisually">${asText(media.title)}</figcaption>
        </figure>
      ` : null}
      <div class="Engager-share">
        ${shareable({ onclick: onclick, href: href, text: __('Share image'), examples: true })}
      </div>
    </article>
  `
}

function getActiveImageSrc (element) {
  return (typeof element.currentSrc === 'undefined') ? element.src : element.currentSrc
}
