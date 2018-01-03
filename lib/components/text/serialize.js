const html = require('choo/html')
const raw = require('choo/html/raw')
const { Elements } = require('prismic-richtext')
const { className } = require('../base/utils')

module.exports = serialize

function serialize (element, children) {
  switch (element.type) {
    case Elements.embed: {
      const provider = element.oembed.provider_name
      switch (provider && provider.toLowerCase()) {
        case 'youtube':
        case 'vimeo': return html`
          <div class="${className('Text-embed', {[`Text-embed--${provider.toLowerCase()}`]: provider})}">
            ${raw(element.oembed.html.replace(/<\\\//g, '</'))}
          </div>
        `
        default: return html`
          <div class="${className('Text-embed', {[`Text-embed--${provider && provider.toLowerCase()}`]: provider})}">
            <a href="${element.oembed.url}">${element.oembed.title}</a>
          </div>
        `
      }
    }
    default: return null
  }
}
