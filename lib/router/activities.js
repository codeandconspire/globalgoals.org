const Prismic = require('prismic-javascript')
const Router = require('koa-router')
const { href } = require('../params')

const GOAL_TAG = /^goal-(\d{1,2})$/

const router = module.exports = new Router()

router.get('activities', '/activities', async ctx => {
  /**
   * Fetch page contents
   */

  await Promise.all([
    // All activities
    ctx.prismic.query(
      Prismic.Predicates.at('document.type', 'activity'),
      { ref: ctx.state.ref }
    ).then(body => {
      ctx.state.activities.items = body.results
    }),
    // Page header
    ctx.prismic.getByUID('landing_page', 'activities', {
      ref: ctx.state.ref
    }).then(doc => {
      ctx.state.pages.items.push(doc)
    })
  ])
})

router.get('activity', '/activities/:activity', async ctx => {
  const { activities } = ctx.state

  /**
   * Get activity
   */

  const doc = await ctx.prismic.query(
    Prismic.Predicates.at('my.activity.uid', ctx.params.activity),
    { ref: ctx.state.ref }
  ).then(body => {
    ctx.assert(body.results.length, 404)
    activities.items.push(body.results[0])
    return body.results[0]
  })

  /**
   * Handle redirect instructions
   */

  if (doc.data.redirect.link_type === 'Document') {
    return ctx.redirect(href(doc.data.redirect))
  } else if (doc.data.redirect.link_type === 'Web') {
    return ctx.redirect(doc.data.redirect.url)
  } else if (doc.data.redirect.link_type === 'Media') {
    return ctx.redirect(doc.data.redirect.url)
  }

  /**
   * Get all goals that are tagged on this initative
   */

  const tags = goalTags(activities.items)
  if (tags.length) {
    await ctx.prismic.query(
      Prismic.Predicates.any('my.goal.number', tags),
      { ref: ctx.state.ref }
    ).then(body => {
      body.results.forEach(doc => {
        ctx.state.goals.items.push(doc)
      })
    })
  }

  await Promise.all(doc.data.slices
    .filter(slice => {
      const { slice_type: type, primary: { link } } = slice
      return type === 'link' && link.link_type === 'Document' && !link.isBroken
    })
    .map(slice => {
      return ctx.prismic.getByID(slice.primary.link.id, {
        ref: ctx.state.ref
      }).then(doc => {
        ctx.assert(doc, 500, 'Content missing')
        switch (doc.type) {
          case 'goal': break
          case 'activity': ctx.state.activities.items.push(doc); break
          case 'news': ctx.state.articles.items.push(doc); break
          default: ctx.state.pages.items.push(doc); break
        }
      })
    })
  )
})

/**
 * Get a list of all goals that are tagged in given list of documents
 *
 * @param {Prismic.Document[]} docs List of Prismic documents (with tags)
 * @returns {string[]}
 */

function goalTags (docs) {
  return docs.reduce((all, doc) => {
    return all.concat(doc.tags.map(tag => tag.match(GOAL_TAG)))
  }, []).filter(Boolean).map(match => parseInt(match[1], 10))
}
