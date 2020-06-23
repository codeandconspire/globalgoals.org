const assert = require('assert')
const html = require('choo/html')
const { asText } = require('prismic-richtext')
const { __ } = require('../../locale')
const player = require('./player')

module.exports = embed

function embed (props, opts = {}) {
  assert(props.video, 'embed: only video embeds are supported')

  var provider = props.video.provider_name
  assert(provider === 'YouTube' || provider === 'Vimeo', 'embed: only YouTube and Vimeo videos are supported')

  return html`
    <div class="Embed ${opts.fill ? 'Embed--fill' : ''}">
      <figure class="Embed-wrapper">
        <img class="Embed-image" src="${props.video.thumbnail_url}" width="${props.video.witdh}" height="${props.video.height}">
        <figcaption class="u-hiddenVisually">${props.video.title}</figcaption>
      </figure>
      <a href="${props.video.embed_url}" rel="noopener noreferrer" class="Embed-link" onclick=${onclick}>
        <span class="Embed-trigger">${__('View on %s', provider)}</span>
      </a>
      <div class="Embed-meta">
        <div class="Text u-colorWhite">
          <h3 class="Text-h4">${props.heading.length ? asText(props.heading) : props.video.title}</h3>
          <p class="Embed-description">${props.description.length ? asText(props.description) : null}</p>
        </div>
      </div>
    </div>
  `

  function onclick (event) {
    player.render(props.video.embed_url)
    event.preventDefault()
  }
}
