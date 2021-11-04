const html = require('choo/html')
const Component = require('nanocomponent')
const { asText } = require('prismic-richtext')
const asElement = require('prismic-element')
const Link = require('./link')
const logo = require('../logo')
const card = require('../card')
const embed = require('../embed')
const player = require('../embed/player')
const Nanocache = require('../base/utils/cache')
const { href } = require('../../params')
const { __ } = require('../../locale')

const TOTAL_GOALS = 17

class GridLink extends Link {
  static identity (goal) {
    return `grid-link-${goal}`
  }
}

module.exports = class GoalGrid extends Component {
  constructor (id, state, emit) {
    super(id)
    this.cache = new Nanocache(state, emit)
    this.state = state
    this.emit = emit
  }

  static identity () {
    return 'goal-grid'
  }

  update () {
    const inTransition = this.state.transitions.includes('takeover')
    return this.state.goals.items.length > this.length && !inTransition
  }

  unload () {
    this.cache.prune()
  }

  createElement (doc) {
    const state = this.state
    const emit = this.emit

    /**
     * Remember number of availible goals on last render
     */

    this.length = state.goals.items.length

    /**
     * Compose list of goals and placeholders for goals being fetched
     */

    const goals = []
    for (let i = 0; i < TOTAL_GOALS; i += 1) {
      goals.push(state.goals.items.find(item => item.data.number === i + 1))
    }

    return html`
      <div class="GoalGrid ${state.layout ? 'GoalGrid--layout GoalGrid--layout' + state.layout : ''}" id="${this._name}">
        ${goals.map((doc, index) => this.cache.render(GridLink, index + 1, doc))}
        ${state.layout && doc && doc.data.grid_slots && doc.data.grid_slots[0] ? largeBanner(doc && doc.data.grid_slots[0]) : null}
        ${state.layout && doc && doc.data.grid_slots && doc.data.grid_slots[1] ? smallBanner(doc && doc.data.grid_slots[1]) : null}
        <div class="GoalGrid-item GoalGrid-item--logo">
          <div class="GoalGrid-bg">
            <div class="GoalGrid-content">
              <div class="GoalGrid-logo">${logo.vertical()}</div>
            </div>
          </div>
        </div>
      </div>
    `

    function largeBanner (props) {
      if (!props) {
        return html`
          <div class="GoalGrid-item GoalGrid-item--cta">
            <div class="GoalGrid-bg">
              <div class="GoalGrid-content">
                <div class="GoalGrid-details">
                  <div class="GoalGrid-desc Text Text--growingLate">
                    <h3 class="u-loadingOnColor">${__('LOADING_TEXT_SHORT')}</h3>
                    <p class="u-loadingOnColor">${__('LOADING_TEXT_LONG')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `
      }

      let video = props.primary.video && props.primary.video.provider_name === 'YouTube' ? props.primary.video : null
      if (video) {
        return html`
          <div class="GoalGrid-item GoalGrid-item--cta">
            ${embed(props.primary, { fill: true })}
          </div>
        `
      }

      const image = props.primary.image && props.primary.image.url

      const content = html`
        <div class="GoalGrid-bg">
          <div class="GoalGrid-content">
            ${image ? card(state, emit, asBannerCard(props), { banner: true, growingText: true }) : html`
              <div class="GoalGrid-details">
                <div class="GoalGrid-desc Text Text--growingLate">
                  ${props.primary.title ? html`<h3>${asText(props.primary.title)}</h3>` : null}
                  ${props.primary.body ? html`<p class="GoalGrid-paragraph">${asText(props.primary.body)}</p>` : null}
                </div>
                <div class="GoalGrid-logo">${logo.horizontal()}</div>
                ${props.primary.link ? html`<span class="GoalGrid-button">${__('Go to website')}</span>` : null}
              </div>
            `}
          </div>
        </div>
      `

      if (props.primary.link && !image) {
        const isDocument = props.primary.link.link_type === 'Document'
        const isExternal = !isDocument && props.primary.link.link_type !== 'Media' && props.primary.link.link_type !== 'Any'
        const hash = !isDocument && !isExternal ? '#contribute' : null

        return html`
          <a class="GoalGrid-item GoalGrid-item--cta" href="${hash || (isDocument ? href(props.primary.link) : props.primary.link.url)}" target="${isExternal ? '_blank' : '_self'}" rel="${isExternal ? 'noopener noreferrer' : ''}">
            ${content}
          </a>
        `
      }

      return html`<div class="GoalGrid-item GoalGrid-item--cta">${content}</div>`
    }

    function smallBanner (props) {
      let bannerClassName = 'GoalGrid-item GoalGrid-item--banner'

      let video = props.primary.video && props.primary.video.provider_name === 'YouTube' ? props.primary.video : null

      const content = html`
        <div class="GoalGrid-bg">
          <div class="GoalGrid-content">
            <div class="GoalGrid-details">
              ${props ? html`
                <div class="GoalGrid-desc Text Text--compact Text--growingLate">
                  ${video ? html`
                    ${props.primary.heading ? html`<span>${asText(props.primary.heading)}</span>` : html`<span>${video.author_name ? '@' + video.author_name : ''}</span>`}
                    ${props.primary.description ? html`<div class="Text-h4 Text-marginTopNone">${asText(props.primary.description)}</div>` : html`<div class="Text-h4 Text-marginTopNone">${video.title}</div>`}
                  ` : html`
                    ${props.primary.title ? html`<span>${asText(props.primary.title)}</span>` : null}
                    ${props.primary.body ? html`<div class="Text-h4 Text-marginTopNone">${asElement(props.primary.body)}</div>` : null}
                  `}
                </div>
              ` : html`
                <div class="GoalGrid-desc Text Text--growingLate">
                  <span class="u-loadingOnColor">${__('LOADING_TEXT_SHORT')}</span>
                  <p class="u-loadingOnColor">${__('LOADING_TEXT_LONG')}</p>
                </div>
              `}
              ${video || props.primary.link ? html`<span class="GoalGrid-button">${video ? __('Watch video') : __('Read more')}</span>` : null}
            </div>
          </div>
        </div>
      `

      if (props && props.primary.link) {
        const isDocument = props.primary.link.link_type === 'Document'
        const isExternal = !isDocument && props.primary.link.link_type !== 'Media'

        return html`
          <a class="${bannerClassName}" href="${isDocument ? href(props.primary.link) : props.primary.link.url}" target="${isExternal ? '_blank' : '_self'}" rel="${isExternal ? 'noopener noreferrer' : ''}">
            ${content}
          </a>
        `
      }

      function playVideo (event) {
        player.render(video.embed_url)
        event.preventDefault()
      }

      if (props && video) {
        return html`
          <a class="${bannerClassName}" onclick=${playVideo} href="${props.primary.video.embed_url}" target="_blank" rel="noopener noreferrer">
            ${content}
          </a>
        `
      }

      return html`<div class="GoalGrid-item GoalGrid-item--cta">${content}</div>`
    }
  }
}

function asBannerCard (props) {
  let url

  if (props.primary.link.link_type === 'Document') {
    url = href(props.primary.link)
  } else if (props.primary.link.link_type === 'Web') {
    url = props.primary.link.url
  } else if (props.primary.link.link_type === 'Media') {
    url = props.primary.link.url
  } else {
    url = href(props.primary.link)
  }

  return {
    title: asText(props.primary.title),
    image: props.primary.image,
    body: asText(props.primary.body),
    banner: true,
    href: url,
    fill: true,
    link: __('Read more')
  }
}
