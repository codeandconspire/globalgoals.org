// Lazy match for the pattern `/foo/:(bar)/:(baz)`
const PARAMS = /:\((.*?)\)/g

// Application routes formatted for compilation
const ROUTES = exports.routes = {
  'home': '/',
  'organisations': '/organisations',
  'all_media': '/media',
  'faq': '/faq',
  'newsletter': '/newsletter',
  'activities': '/activities',
  'activity': '/activities/:(uid)',
  'news': '/news',
  'article': '/news/:(uid)',
  'resources': '/resources',
  '404': '/404',
  'error': '/error',
  'page': '/:(uid)',
  'goal': '/:(data.number)-:(uid)',
  'goal_organisations': '/:(data.number)-:(uid)/organisations',
  'goal_newsletter': '/:(data.number)-:(uid)/newsletter',
  'goal_tips': '/:(data.number)-:(uid)/tips-tricks',
  'goal_media': '/:(data.number)-:(uid)/media',
  'media': '/:(doc.data.number)-:(doc.uid)/media/:(media.slug)'
}

/**
 * Produce a URL for given document
 * @param {object} state
 * @param {object?} doc
 * @return {string|function}
 */

exports.href = function href (doc) {
  switch (doc.type) {
    case 'news': return resolve(ROUTES.article, doc)
    case 'home_page': return resolve(ROUTES.home, doc)
    case 'landing_page': return resolve(ROUTES[doc.uid], doc)
    default: return resolve(ROUTES[doc.type], doc)
  }
}

/**
 * Resolve path to document
 * @param {string} path
 * @param {object} doc
 * @return {string}
 */

exports.resolve = resolve
function resolve (path, doc) {
  let result = path
  let part
  while ((part = PARAMS.exec(path))) {
    result = result.replace(part[0], lookup(part[1], doc))
  }

  return result
}

/**
 * Lookup path in object
 * @param {string} path
 * @param {object} src
 * @return {any}
 */

exports.lookup = lookup
function lookup (path, src) {
  return path.split('.').reduce((props, key) => props[key], src)
}
