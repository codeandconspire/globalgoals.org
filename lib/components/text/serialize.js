const html = require('choo/html')
const raw = require('choo/html/raw')
const { Elements } = require('prismic-richtext')
const { className } = require('../base/utils')
const { href } = require('../../params')

module.exports = serialize

function serialize (element, content, children) {
  switch (element.type) {
    case Elements.heading1: return html`<h1 id="${id(content)}">${children}</h1>`
    case Elements.heading2: return html`<h2 id="${id(content)}">${children}</h2>`
    case Elements.heading3: return html`<h3 id="${id(content)}">${children}</h3>`
    case Elements.heading4: return html`<h4 id="${id(content)}">${children}</h4>`
    case Elements.heading5: return html`<h5 id="${id(content)}">${children}</h5>`
    case Elements.heading6: return html`<h6 id="${id(content)}">${children}</h6>`
    case Elements.hyperlink: {
      if (element.data.target && element.data.target === '_blank') {
        return html`<a href="${resolve(element.data)}" target="_blank" rel="noopener noreferrer">${children}</a>`
      }
      return html`<a href="${resolve(element.data)}">${children}</a>`
    }
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

/**
 * Resolve link fixing Prismic adding protocol to anchor naked anchor links
 *
 * @param {obj} link
 * @returns str
 */

function resolve (link) {
  if (link.link_type === 'Document') return href(link, link.isBroken)
  if (/https?:\/\/#/.test(link.url)) return `#${link.url.split('#')[1]}`
  return link.url
}

/**
 * Generate url friendly string from text
 * @param {str} text
 */

function id (text) {
  return text.replace(/[^\w]/g, '-').replace(/-{2,}/, '-').toLowerCase()
}
