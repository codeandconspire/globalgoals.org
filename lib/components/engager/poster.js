const html = require('choo/html')
const { asText } = require('prismic-richtext')
const { image } = require('../base/utils')
const shareable = require('../shareable')
const { resolve, routes } = require('../../params')
const { __ } = require('../../locale')

module.exports = function poster (state, doc, media, emit) {
  let href
  if (media.link.url) {
    href = media.link.url
  } else {
    href = resolve(routes.media, {doc, media})
    if (!href) {
      href = resolve(routes.goal, doc)
    }
  }

  const img = image(media.image, [ 'small', 'medium' ])
  let id = media.slug
  if (!id && media.link.url) {
    const filename = media.link.url.match(/\/([^/]*?)(?=\.\w+$)/)
    id = filename ? `poster-${filename[1]}` : null
  }

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

  function onclick (event) {
    if (media.link.url) {
      window.location.assign(href)
    } else if (!state.ui.share) {
      emit('ui:share:toggle', {
        href,
        title: asText(media.title).trim(),
        image: getActiveImageSrc(document.querySelector(`#${id} .js-image`)),
        asset: media.link.url || media.image.url,
        description: asText(media.description).trim()
      })
    }

    event.preventDefault()
  }

  function getActiveImageSrc (element) {
    return (typeof element.currentSrc === 'undefined') ? element.src : element.currentSrc
  }
}
