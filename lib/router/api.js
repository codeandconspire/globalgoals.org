const url = require('url');
const Router = require('koa-router');
const got = require('got');

const TWITTER_ENDPOINT = 'https://api.twitter.com';
const TWITTER_BEARER_TOKEN = Buffer.from([
  encodeURIComponent(process.env.TWITTER_CONSUMER_KEY),
  encodeURIComponent(process.env.TWITTER_CONSUMER_SECRET)
].join(':')).toString('base64');

const router = module.exports = new Router();

/**
 * Expose entire (bare) state under api root path
 */

router.get('api', '/api', async (ctx, next) => {
  if (ctx.accepts('json')) {
    ctx.body = JSON.stringify(ctx.state);
  } else {
    ctx.throw(406);
  }

  return next();
});

/**
 * Proxy calls to Twitter
 */

router.get('twitter', '/api/twitter', async (ctx, next) => {
  const { hashtag } = ctx.query;

  ctx.type = 'application/json';

  /**
   * Get Application only access token
   */

  const { access_token } = await got(url.resolve(TWITTER_ENDPOINT, '/oauth2/token'), {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${ TWITTER_BEARER_TOKEN }`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: 'grant_type=client_credentials'
  }).then(response => JSON.parse(response.body));

  /**
   * Figure out what to fetch
   */

  let path;
  if (hashtag) {
    const query = encodeURIComponent(hashtag.replace(/^#?/, '#'));
    path = `/1.1/search/tweets.json?count=12&q=${ query }`;
  } else {
    const user = encodeURIComponent(process.env.GLOBALGOALS_TWITTER_ID);
    path = `/1.1/statuses/user_timeline.json?count=12&screen_name=${ user }`;
  }

  /**
   * Fetch tweets using access token
   */

  ctx.body = await got(url.resolve(TWITTER_ENDPOINT, path), {
    json: true,
    headers: {
      'Authorization': `Bearer ${ access_token }`
    }
  }).then(response => response.body);

  return next();
});

/**
 * Treat everything mathing the api root route as JSON
 */

router.use((ctx, next) => {
  ctx.type = 'application/json';
  return next();
});
