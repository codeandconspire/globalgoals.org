const url = require('url');
const { asText } = require('prismic-richtext');
const { __ } = require('../../locale');
const { color } = require('../base');

const TAGS = {
  'og:title': state => state.title.split('|')[0].trim(),
  'og:description': state => description(state).trim(),
  'og:image': state => url.resolve(process.env.GLOBALGOALS_URL, image(state)),
  'og:url': state => url.resolve(process.env.GLOBALGOALS_URL, state.href),
  'theme': state => theme(state)
};

exports.render = render;
exports.update = update;

function update(state) {
  Object.entries(TAGS).forEach(([ key, get ]) => {
    const tag = document.querySelector(`[property="${ key }"]`);

    if (tag) {
      tag.setAttribute('content', get(state));
    }
  });
}

function render(state) {
  const tags = [
    '<meta charset="utf-8">',
    '<meta http-equiv="x-ua-compatible" content="ie=edge">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<meta property="theme" name="theme-color" content="${ TAGS['theme'](state) }">`,
    `<meta property="og:title" content="${ TAGS['og:title'](state) }">`,
    `<meta property="og:description" content="${ TAGS['og:description'](state) }">`,
    `<meta property="og:image" content="${ TAGS['og:image'](state) }">`,
    '<meta property="og:image:width" content="1160">',
    '<meta property="og:image:height" content="1160">',
    `<meta property="og:url" content="${ TAGS['og:url'](state) }">`,
    `<meta property="og:site_name" content="${ process.env.GLOBALGOALS_NAME }">`,
    '<meta name="twitter:card" content="summary_large_image">'
  ];

  if (process.env.GLOBALGOALS_TWITTER_ID) {
    tags.push(`
      <meta name="twitter:site" content="@${ process.env.GLOBALGOALS_TWITTER_ID }">
    `);
  }

  if (process.env.GLOBALGOALS_FACEBOOK_ID) {
    tags.push(`
      <meta property="fb:app_id" content="${ process.env.GLOBALGOALS_FACEBOOK_ID }">
    `);
  }

  return tags;
}

/**
 * Determine document description
 * @param {object} state
 * @returns {string}
 */

function description(state) {
  const doc = getDocument(state);

  if (doc) {
    return asText(doc.data.introduction);
  }

  return __('DEFAULT_DESCRIPTION');
}

/**
 * Determine document image
 * @param {object} state
 * @return {string}
 */

function image(state) {
  const doc = getDocument(state);

  if (state.routeName === 'goal') {
    return `/${ state.params.goal }.png`;
  }

  return (doc && doc.data.image && doc.data.image.url) || '/share.png';
}

/**
 * Determine document theme
 * @param {object} state
 * @return {string}
 */

function theme(state) {
  return state.params.goal ? color(state.params.goal) : '#fff';
}

/**
 * Find document by route name
 * @param {object} state
 * @returns {object}
 */

function getDocument(state) {
  switch (state.routeName) {
    case 'home':
    case 'news':
    case 'initiatives': return state.pages.items.find(item => {
      return item.uid === state.routeName;
    });
    case 'goal': return state.goals.items.find(item => {
      return item.data.number === state.params.goal;
    });
    case 'initiative': return state.initiatives.items.find(item => {
      return item.uid === state.params.initiative;
    });
    case 'article': return state.articles.items.find(item => {
      return item.uid === state.params.article;
    });
    case 'page': return state.pages.items.find(item => {
      return item.uid === state.params.page;
    });
    default: null;
  }
}
