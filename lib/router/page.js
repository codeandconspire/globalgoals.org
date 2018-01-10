const Router = require('koa-router')
const Prismic = require('prismic-javascript')
const { href } = require('../params')

const TAG_REGEX = /^goal-(\d{1,2})$/

const router = module.exports = new Router()

router.get('/:path/:sub_path?', async (ctx, next) => {
  const uid = ctx.params.sub_path || ctx.params.path

  /**
   * Optimistically lookup pages by root path
   */

  const doc = await ctx.prismic.query(
    Prismic.Predicates.in('my.page.uid', Object.values(ctx.params).filter(Boolean))
  ).then(response => {
    ctx.state.pages.items.push(...response.results)
    return response.results.find(doc => doc.uid === uid)
  })

  if (!doc) return next()

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
    await ctx.prismic.query(
      Prismic.Predicates.any('my.goal.number', goals)
    ).then(response => {
      ctx.state.goals.items.push(...response.results)
    })
  }

  return Promise.all(doc.data.slices
    .filter(slice => {
      const { slice_type: type, primary: { link } } = slice
      return type === 'link' && link.link_type === 'Document' && !link.isBroken
    })
    .map(slice => {
      return ctx.prismic.getByID(slice.primary.link.id).then(doc => {
        ctx.assert(doc, 500, 'Content missing')
        switch (doc.type) {
          case 'goal': break
          case 'news': ctx.state.articles.items.push(doc); break
          default: ctx.state.pages.items.push(doc); break
        }
      })
    })
  )
})
