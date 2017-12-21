const html = require('choo/html')
const poster = require('./poster')
const newsletter = require('./newsletter')
const organisations = require('./organisations')
const tips = require('./tips')
const { resolve, routes } = require('../../params')
const { __ } = require('../../locale')

exports.messages = function (state, doc, emit) {
  return {
    id: 'message',
    title: __('Share a Message'),
    href: resolve(
      routes[doc.type === 'goal' ? 'goal_media' : 'all_media'],
      doc
    ),
    content () {
      // Make sure to only show media with an url (for permalinking)
      const include = media => media.link.url || media.slug

      let posters
      if (doc.data.media) {
        posters = doc.data.media
          .filter(include)
          .map(media => poster(state, doc, media, emit))
      } else {
        posters = state.goals.items
          .filter(goal => goal.data.media.length)
          .map(goal => {
            const media = goal.data.media.filter(include)
            const props = media[Math.floor(Math.random() * media.length)]
            return poster(state, goal, props, emit)
          })
      }

      return html`
        <div class="Grid Grid--masonry Grid--sm2col Grid--md3col" id="${doc.id}-media">
          ${posters.map((item, index) => html`
            <div class="Grid-cell" id="${doc.id}-media-${index}">
              ${item}
            </div>
          `)}
        </div>
      `
    }
  }
}

exports.organisations = function (state, doc, emit) {
  return {
    id: 'organisations',
    title: __('Join an Organisation'),
    href: resolve(
      routes[doc.type === 'goal' ? 'goal_organisations' : 'organisations'],
      doc
    ),
    content: () => organisations(state, doc, emit)
  }
}

exports.tips = function (state, doc) {
  return {
    id: 'tips',
    title: doc.type === 'goal' ? __('Tips & Tricks') : __('Understand The Goals'),
    href: resolve(
      routes[doc.type === 'goal' ? 'goal_tips' : 'faq'],
      doc
    ),
    content: () => tips(state, doc)
  }
}

exports.newsletter = function (state, doc, emit) {
  return {
    id: 'newsletter',
    title: __('Stay Updated'),
    href: resolve(
      routes[doc.type === 'goal' ? 'goal_newsletter' : 'newsletter'],
      doc
    ),
    content: () => newsletter(state, emit)
  }
}
