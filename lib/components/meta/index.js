const url = require('url');
const { asText } = require('prismic-richtext');
const { __ } = require('../../locale');
const { color } = require('../base');

const TAGS = {
  'og:title': state => title(state),
  'og:description': state => description(state),
  'og:image': state => image(state),
  'og:url': state => url.resolve(process.env.GLOBALGOALS_URL, state.href),
  'theme': state => theme(state)
};

exports.render = render;
exports.update = update;
exports.title = title;
exports.image = image;
exports.description = description;

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
    `<meta name="description" content="${ description(state) }">`,
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<meta property="theme" name="theme-color" content="${ TAGS['theme'](state) }">`,
    `<meta property="og:title" content="${ TAGS['og:title'](state) }">`,
    `<meta property="og:description" content="${ TAGS['og:description'](state) }">`,
    `<meta property="og:image" content="${ TAGS['og:image'](state) }">`,
    `<meta property="og:image:width" content="${ width(state) }">`,
    `<meta property="og:image:height" content="${ height(state) }">`,
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

function title(state) {
  if (state.routeName === 'media') {
    const doc = getDocument(state);

    if (doc) {
      const media = doc.data.media.find(item => item.slug === state.params.media);

      if (media) {
        return asText(media.title).trim();
      }
    }
  }

  return (state.title || process.env.GLOBALGOALS_NAME).split('|')[0].trim();
}

/**
 * Determine document description
 * @param {object} state
 * @returns {string}
 */

function description(state) {
  const doc = getDocument(state);

  if (doc) {
    if (state.routeName === 'media') {
      const media = doc.data.media.find(item => item.slug === state.params.media);

      if (media) {
        return asText(media.description).trim();
      }
    }

    return asText(doc.data.introduction).trim();
  }

  return __('DEFAULT_DESCRIPTION');
}

/**
 * Determine document image
 * @param {object} state
 * @return {string}
 */

function image(state) {
  let src;
  const image = imageView(state);

  if (state.routeName === 'goal') {
    src = `/${ state.params.goal }.png`;
  } else {
    src = image && image.url || '/share.png';
  }

  return url.resolve(process.env.GLOBALGOALS_URL, src);
}

/**
 * Get image width
 * @param {object} state
 * @returns {number}
 */

function width(state) {
  const image = imageView(state);
  return image && image.dimensions.width || 1160;
}

/**
 * Get image height
 * @param {object} state
 * @returns {number}
 */

function height(state) {
  const image = imageView(state);
  return image && image.dimensions.height || 1160;
}

/**
 * Get image view
 * @param {object} state
 * @returns {object}
 */

function imageView(state) {
  const doc = getDocument(state);

  if (doc) {
    if (state.routeName === 'media') {
      const media = doc.data.media.find(item => item.slug === state.params.media);

      if (media && media.image.url) {
        return media.image;
      }
    }

    if (doc.data.image && doc.data.image.url) {
      return doc.data.image;
    }
  }

  return null;
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
    case 'goal':
    case 'media': return state.goals.items.find(item => {
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
