const Prismic = require('prismic-javascript');
const Router = require('koa-router');
const { resolve } = require('../params')

const TRAILING_SLASH = '(/)?';

const router = module.exports = new Router();

// TODO: Redirect http://* => https://www.*
const routeMap = {
  '/prayer-for-everyone': 'http://www.prayerforeveryone.org',
  '/anti-corruption': '/anti-corruption-policy',
  '/privacy': '/privacy-policy',
  '/global-goals': '/',
  '/project-everyone': 'http://www.project-everyone.org',
  '/radio-everyone-partners': 'http://www.project-everyone.org/radio-everyone/',
  '/cinema': 'https://www.youtube.com/watch?v=7V3eSHgMEFM',
  // TODO: Create route `/app`
  '/2015/09/29/download-the-global-goals-app': '/app',
  '/now': '/app',
  '/resource-centre': '/resources',
  '/resource-centre/mobile-phone-operators': '/resources',
  '/resource-centre/the-basics': '/resources',
  '/media-centre': '/resources',
  '/outcomes': '/',
  // TODO: Ensure id is correct
  '/tell-everyone(/*)?': '/#tell-everyone'
};

Object.keys(routeMap).forEach(route => {
  router.get(route + TRAILING_SLASH, ctx => ctx.redirect(routeMap[route]));
});

router.get('/global-goals/:legacy_slug', async ctx => {
  await ctx.prismic.query(
    Prismic.Predicates.at('my.goal.legacy_slug', ctx.params.legacy_slug)
  ).then(body => {
    if (!body.results.length) {
      ctx.redirect('/');
    } else {
      const doc = body.results[0];
      ctx.redirect(resolve(ctx.state.routes.goal, {
        goal: doc.data.number,
        slug: doc.uid
      }));
    }
  });
});
