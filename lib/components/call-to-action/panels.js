const html = require('choo/html');
const poster = require('./poster');
const newsletter = require('./newsletter');
const organisations = require('./organisations');
const tips = require('./tips');
const { resolve } = require('../../params');
const { __ } = require('../../locale');

exports.messages = function (state, doc, emit) {
  return {
    id: 'message',
    title: __('Share a Message'),
    href: resolve(
      state.routes[doc.type === 'goal' ? 'goal_media' : 'all_media'],
      state.params
    ),
    content() {
      // Make sure to only show media with a slug (for permalinking)
      const hasSlug = media => media.slug;

      let posters;
      if (doc.data.media) {
        posters = doc.data.media
          .filter(hasSlug)
          .map(media => poster(state, doc, media, emit));
      } else {
        posters = state.goals.items
          .filter(goal => goal.data.media.length)
          .map(goal => poster(state, goal, goal.data.media.find(hasSlug), emit));
      }

      return html`
        <div class="Grid Grid--masonry Grid--sm2col Grid--md3col" id="${ doc.id }-media">
          ${ posters.map((item, index) => html`
            <div class="Grid-cell Grid-cell--appear"  id="${ doc.id }-media-${ index }" style="animation-delay: ${ index * 100 }ms;">
              ${ item }
            </div>
          `) }
        </div>
      `
    }
  };
};

exports.organisations = function (state, doc, emit) {
  return {
    id: 'organisations',
    title: __('Join an Organisation'),
    href: resolve(
      state.routes[doc.type === 'goal' ? 'goal_organisations' : 'organisations'],
      state.params
    ),
    content: () => organisations(state, doc, emit)
  };
};

exports.tips = function (state, doc) {
  return {
    id: 'tips',
    title: doc.type === 'goal' ? __('Tips & Tricks') : __('Understand The Goals'),
    href: resolve(
      state.routes[doc.type === 'goal' ? 'goal_tips' : 'faq'],
      state.params
    ),
    content: () => tips(state, doc)
  };
};

exports.newsletter = function (state, doc, emit) {
  return {
    id: 'newsletter',
    title: __('Sign Up For Newsletter'),
    href: resolve(
      state.routes[doc.type === 'goal' ? 'goal_newsletter' : 'newsletter'],
      state.params
    ),
    content: () => newsletter(state, emit)
  };
};
