const html = require('choo/html');
const component = require('fun-component');
const { asText } = require('prismic-richtext');
const asElement = require('prismic-element');
const createLink = require('./link');
const logo = require('../logo');
const { luma } = require('../base/utils');
const { href } = require('../../params');
const { __ } = require('../../locale');
const links = [];

module.exports = component({
  name: 'goal-grid',
  cache: true,
  update(element, [state]) {
    return state.goals.items.length > this.length;
  },
  render(state, emit, doc) {

    /**
     * Remember number of availible goals on last render
     */

    this.length = state.goals.items.length;

    /**
     * Compose list of goals and placeholders for goals being fetched
     */

    const goals = [];
    for (let i = 0; i < state.goals.total; i += 1) {
      goals.push(state.goals.items.find(item => item.data.number === i + 1));
    }

    let bgStyle = '';
    let bannerClassName = 'GoalGrid-item GoalGrid-item--banner';
    const bannerColor = doc && doc.data.banners[1].color;
    if (bannerColor) {
      bgStyle = `background-color: ${ bannerColor };`;
      if (luma(bannerColor) < 160) {
        bannerClassName += ' GoalGrid-item--dark';
      } else {
        bannerClassName += ' GoalGrid-item--light';
      }
    }

    return html`
      <div class="GoalGrid ${ state.layout ? 'GoalGrid--layout' + state.layout : '' }">
        ${ goals.map((doc, index) => {
          if (!links[index]) {
            links.push(createLink(state, index + 1, emit));
          }

          return links[index](doc);
        }) }
        <a class="GoalGrid-item GoalGrid-item--cta" href="${ url(doc.data.banners[0].link, '#call-to-action') }">
          <div class="GoalGrid-bg">
            <div class="GoalGrid-content">
              <div class="GoalGrid-details">
                ${ doc ? html`
                  <div class="GoalGrid-desc Text Text--growingLate">
                    <h3>${ asText(doc.data.banners[0].title) }</h3>
                    <div class="GoalGrid-paragraph">${ asElement(doc.data.banners[0].body) }</div>
                  </div>
                ` : html`
                  <div class="GoalGrid-desc Text Text--growingLate">
                    <h3 class="u-loadingOnColor">${ __('LOADING_TEXT_SHORT') }</h3>
                    <p class="u-loadingOnColor">${ __('LOADING_TEXT_LONG') }</p>
                  </div>
                ` }
                <div class="GoalGrid-logo">${ logo() }</div>
                ${ doc ? html`<span class="GoalGrid-button">${ doc.data.banners[0].link_text }</span>` : null }
              </div>
            </div>
          </div>
        </a>
        <a class="${ bannerClassName }" href="${ url(doc.data.banners[1].link) }">
          <div class="GoalGrid-bg" style="${ bgStyle }">
            <div class="GoalGrid-content">
              <div class="GoalGrid-details">
                ${ doc ? html`
                  <div class="GoalGrid-desc Text Text--adaptive Text--compact Text--growingLate">
                    <span>${ asText(doc.data.banners[1].title) }</span>
                    <div class="Text-h4 Text-marginTopNone">${ asElement(doc.data.banners[1].body) }</div>
                  </div>
                ` : html`
                  <div class="GoalGrid-desc Text Text--growingLate">
                    <span class="u-loadingOnColor">${ __('LOADING_TEXT_SHORT') }</span>
                    <p class="u-loadingOnColor">${ __('LOADING_TEXT_LONG') }</p>
                  </div>
                ` }
                ${ doc ? html`<span class="GoalGrid-button">${ doc.data.banners[1].link_text }</span>` : null }
              </div>
            </div>
          </div>
        </a>
        <div class="GoalGrid-item GoalGrid-item--logo">
          <div class="GoalGrid-bg">
            <div class="GoalGrid-content">
              <div class="GoalGrid-logo">${ logo({ horizontal: false }) }</div>
            </div>
          </div>
        </div>
      </div>
    `;

    function url(link, fallback = '') {
      if (doc && link.link_type === 'Document') {
        return href(state, link);
      } else if (link.link_type === 'Web' || link.link_type === 'Media') {
        return link.url;
      }
      return fallback;
    }
  }
});
