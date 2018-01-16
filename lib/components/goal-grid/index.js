const html = require('choo/html')
const Component = require('nanocomponent')
const { asText } = require('prismic-richtext')
const asElement = require('prismic-element')
const Link = require('./link')
const logo = require('../logo')
const { luma } = require('../base/utils')
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
        ${state.layout ? largeBanner(doc && doc.data.banners[0]) : null}
        ${state.layout ? smallBanner(doc && doc.data.banners[1]) : null}
        <div class="GoalGrid-item GoalGrid-item--logo">
          <div class="GoalGrid-bg">
            <div class="GoalGrid-content">
              <div class="GoalGrid-logo">${logo.vertical()}</div>
            </div>
          </div>
        </div>
      </div>
    `
  }
}

function largeBanner (props) {
  const content = html`
    <div class="GoalGrid-bg">
      <div class="GoalGrid-content">
        <div class="GoalGrid-details">
          ${props ? html`
            <div class="GoalGrid-desc Text Text--growingLate">
              <h3>${asText(props.title)}</h3>
              <p class="GoalGrid-paragraph">${asText(props.body)}</p>
            </div>
          ` : html`
            <div class="GoalGrid-desc Text Text--growingLate">
              <h3 class="u-loadingOnColor">${__('LOADING_TEXT_SHORT')}</h3>
              <p class="u-loadingOnColor">${__('LOADING_TEXT_LONG')}</p>
            </div>
          `}
          <div class="GoalGrid-logo">${logo.horizontal()}</div>
          ${props && props.link_text ? html`<span class="GoalGrid-button">${props.link_text}</span>` : null}
        </div>
      </div>
    </div>
  `

  if (props && props.link_text) {
    const isDocument = props.link.link_type === 'Document'
    const isExternal = !isDocument && props.link.link_type !== 'Media' && props.link.link_type !== 'Any'
    const hash = !isDocument && !isExternal ? '#contribute' : null

    return html`
      <a class="GoalGrid-item GoalGrid-item--cta" href="${hash || (isDocument ? href(props.link) : props.link.url)}" target="${isExternal ? '_blank' : '_self'}" rel="${isExternal ? 'noopener noreferrer' : ''}">
        ${content}
      </a>
    `
  }

  return html`<div class="GoalGrid-item GoalGrid-item--cta">${content}</div>`
}

function smallBanner (props) {
  let bgStyle = ''
  let bannerClassName = 'GoalGrid-item GoalGrid-item--banner'
  if (props && props.color) {
    bgStyle = `background-color: ${props.color};`
    if (luma(props.color) < 160) {
      bannerClassName += ' GoalGrid-item--dark'
    } else {
      bannerClassName += ' GoalGrid-item--light'
    }
  }

  const content = html`
    <div class="GoalGrid-bg" style="${bgStyle}">
      <div class="GoalGrid-content">
        <div class="GoalGrid-details">
          ${props ? html`
            <div class="GoalGrid-desc Text Text--adaptive Text--compact Text--growingLate">
              <span>${asText(props.title)}</span>
              <div class="Text-h4 Text-marginTopNone">${asElement(props.body)}</div>
            </div>
          ` : html`
            <div class="GoalGrid-desc Text Text--growingLate">
              <span class="u-loadingOnColor">${__('LOADING_TEXT_SHORT')}</span>
              <p class="u-loadingOnColor">${__('LOADING_TEXT_LONG')}</p>
            </div>
          `}
          ${props && props.link_text ? html`<span class="GoalGrid-button">${props.link_text}</span>` : null}
        </div>
      </div>
    </div>
  `

  if (props && props.link_text) {
    const isDocument = props.link.link_type === 'Document'
    const isExternal = !isDocument && props.link.link_type !== 'Media'

    return html`
      <a class="${bannerClassName}" href="${isDocument ? href(props.link) : props.link.url}" target="${isExternal ? '_blank' : '_self'}" rel="${isExternal ? 'noopener noreferrer' : ''}">
        ${content}
      </a>
    `
  }

  return html`<div class="GoalGrid-item GoalGrid-item--cta">${content}</div>`
}
