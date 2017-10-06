const url = require('url');
const Router = require('koa-router');
const got = require('got');

const TWITTER_ENDPOINT = 'https://api.twitter.com';
const TWITTER_BEARER_TOKEN = Buffer.from([
  encodeURIComponent(process.env.TWITTER_CONSUMER_KEY),
  encodeURIComponent(process.env.TWITTER_CONSUMER_SECRET)
].join(':')).toString('base64');

const INSTAGRAM_ENDPOINT = 'https://api.instagram.com';
const INSTAGRAM_SCRAPE_ENDPOINT = 'https://www.instagram.com';
const INSTAGRAM_USER_ID = process.env.GLOBALGOALS_INSTAGRAM_USER_ID;
const INSTAGRAM_ACCESS_TOKEN = process.env.GLOBALGOALS_INSTAGRAM_ACCESS_TOKEN;
const INSTAGRAM_COUNT = 9;

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
 * Proxy calls to Instagram
 */

router.get('instagram', '/api/instagram', async (ctx, next) => {
  const { hashtag } = ctx.query;

  ctx.type = 'application/json';

  /**
   * Figure out what to fetch
   */

  let path;
  let endpoint;

  if (hashtag) {
    path = `/explore/tags/${ hashtag.replace(/^#?/, '') }/`;
    endpoint = url.resolve(INSTAGRAM_SCRAPE_ENDPOINT, path);
  } else {
    path = `/v1/users/${ INSTAGRAM_USER_ID }/media/recent?access_token=${ INSTAGRAM_ACCESS_TOKEN }&count=${ INSTAGRAM_COUNT }`;
    endpoint = url.resolve(INSTAGRAM_ENDPOINT, path);
  }

  /**
   * Photos from our user are fetched from the API but photos from a hashtag has
   * to be scraped from a public Instagram feed.
   */

  ctx.body = await got(endpoint, { json: !hashtag }).then(response => {
    const result = [];

    if (hashtag) {
      try {
        const json = JSON.parse(response.body.match(/<script type="text\/javascript">window\._sharedData = (.+?(?=;<\/script>))/)[1]);
        json.entry_data.TagPage[0].tag.media.nodes.forEach(function (post) {
          if (result.length !== INSTAGRAM_COUNT) {
            result.push({
              url: `https://www.instagram.com/p/${ post.code }/`,
              imageSrc: post.thumbnail_src
            });
          }
        });
      } catch (error) {
        return [];
      }
    } else {
      response.body.data.forEach(function (post) {
        result.push({
          url: post.link,
          imageSrc: post.images.low_resolution.url
        });
      });
    }

    return result;
  });

  return next();
});

/**
 * Treat everything mathing the api root route as JSON
 */

router.use((ctx, next) => {
  ctx.type = 'application/json';
  return next();
});
