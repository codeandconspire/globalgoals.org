const Prismic = require('prismic-javascript')
const Router = require('koa-router')
const { href } = require('../params')

const TAG_REGEX = /^goal-(\d{1,2})$/

const router = module.exports = new Router()

router.get('page', '/:page', async ctx => {
  /**
   * Optimistically lookup pages by root path
   */

  const doc = await ctx.prismic.getByUID('page', ctx.params.page, {
    ref: ctx.state.ref
  }).then(doc => {
    ctx.assert(doc, 404)
    ctx.state.pages.items.push(doc)
    return doc
  })

  /**
   * Handle redirect instructions
   */

  if (doc.data.redirect.link_type === 'Document') {
    return ctx.redirect(href(ctx.state, doc.data.redirect))
  } else if (doc.data.redirect.link_type === 'Web') {
    return ctx.redirect(doc.data.redirect.url)
  } else if (doc.data.redirect.link_type === 'Media') {
    return ctx.redirect(doc.data.redirect.url)
  }

  /**
   * Isolate goals tagged in document
   */

  const goals = doc.tags
    .map(tag => tag.match(TAG_REGEX))
    .filter(Boolean)
    .map(match => parseInt(match[1], 10))

  /**
   * Fetch goals and populate state
   */

  if (goals.length) {
    await ctx.prismic.query(Prismic.Predicates.any('my.goal.number', goals), {
      ref: ctx.state.ref
    }).then(response => {
      ctx.state.goals.items.push(...response.results)
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

  ctx.body = ctx.render(ctx.url)
})
