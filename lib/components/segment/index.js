const html = require('choo/html')
const { asText } = require('prismic-richtext')
const asElement = require('prismic-element')
const serialize = require('../text/serialize')
const { href } = require('../../params')

module.exports = (props, color = 'gray') => {
  return html`
    <div class="Segment" id="segment-${props.id}">
      <figure class="Segment-figure">
        ${props.caption ? html`<figcaption class="Segment-caption u-bg${color}">${props.caption}</figcaption>` : null}
        ${props.image.url ? image(props.image, color) : html`
          <span class="Segment-fallback ${background(color)}"><span class="Segment-fallbackText">${props.fallback || null}</span></span>
        `}
      </figure>
      <div class="Segment-body">
        <div class="Text">
          <h3 class="Text-h4">${asText(props.title)}</h3>
          ${asElement(props.body, href, serialize)}
        </div>
      </div>
    </div>
  `
}

function image (props, color) {
  const { url, alt, dimensions: { width, height } } = props
  const srcset = props['2x'] ? `${props['2x'].url} 2x` : url

  return html`
    <img class="Segment-image ${background(color)}" src="${url}" width="${width}" height="${height}" alt="${alt || ''}" srcset="${srcset}" />
  `
}

function background (color) {
  const str = color + ''
  return `u-bg${str[0].toUpperCase() + str.substr(1)}`
}
