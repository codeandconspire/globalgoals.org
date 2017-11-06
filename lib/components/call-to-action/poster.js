const html = require('choo/html')
const { asText } = require('prismic-richtext')
const { image } = require('../base/utils')
const shareable = require('../shareable')
const { resolve } = require('../../params')
const { __ } = require('../../locale')

module.exports = function poster (state, goal, props, emit) {
  const params = {
    goal: goal.data.number,
    slug: goal.uid,
    referrer: state.params.referrer,
    media: props.slug
  }

  let href
  if (props.link.url) {
    href = props.link.url
  } else {
    href = resolve(state.routes.media, params)

    if (!href) {
      href = resolve(state.routes.goal, params)
    }
  }

  const img = image(props.image, [ 'small', 'medium' ])
  let id = props.slug
  if (!id && props.link.url) {
    const filename = props.link.url.match(/\/([^/]*?)(?=\.\w+$)/)
    id = filename ? `poster-${filename[1]}` : null
  }

  return html`
    <article class="CallToAction-poster Shareable" id="${id}" onclick=${onclick}>
      ${props.image.url ? html`
        <figure class="CallToAction-imageWrapper" style="padding-top: ${img.height / img.width * 100}%">
          <img class="CallToAction-image js-image" src="${img.src}" alt="${props.image.alt || ''}" srcset="${img.srcset}" sizes="${img.sizes}" />
          <figcaption class="u-hiddenVisually">${asText(props.title)}</figcaption>
        </figure>
      ` : null}
      <div class="CallToAction-share">
        ${shareable({ onclick: onclick, href: href, text: __('Share image'), examples: true })}
      </div>
    </article>
  `

  function onclick (event) {
    if (props.link.url) {
      window.location.assign(href)
    } else if (!state.ui.share) {
      emit('ui:share:toggle', {
        href,
        title: asText(props.title).trim(),
        image: getActiveImageSrc(document.querySelector(`#${id} .js-image`)),
        asset: props.link.url || props.image.url,
        description: asText(props.description).trim()
      })
    }

    event.preventDefault()
  }

  function getActiveImageSrc (element) {
    return (typeof element.currentSrc === 'undefined') ? element.src : element.currentSrc
  }
}
