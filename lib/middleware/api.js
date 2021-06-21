const url = require('url')
const got = require('got')
const body = require('koa-body')
const Router = require('koa-router')
const compose = require('koa-compose')

const TWITTER_ENDPOINT = 'https://api.twitter.com'
const TWITTER_BEARER_TOKEN = Buffer.from([
  encodeURIComponent(process.env.TWITTER_CONSUMER_KEY),
  encodeURIComponent(process.env.TWITTER_CONSUMER_SECRET)
].join(':')).toString('base64')

const INSTAGRAM_ENDPOINT = 'https://api.instagram.com'
const INSTAGRAM_SCRAPE_ENDPOINT = 'https://www.instagram.com'
const INSTAGRAM_USER_ID = process.env.INSTAGRAM_USER_ID
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN
const INSTAGRAM_COUNT = 9

const router = new Router()

/**
 * Expose entire (bare) state under api root path
 */

router.get('/api', async ctx => {
  ctx.set('Cache-Control', 'no-cache, private, max-age=0')
  if (ctx.accepts('json')) {
    ctx.type = 'application/json'
    ctx.body = {version: ctx.state.version, ref: ctx.state.ref}
  } else {
    ctx.throw(406)
  }
})

router.post('/api/nominate', compose([
  body({multipart: true}),
  async ctx => {
    const response = await got('https://docs.google.com/forms/u/1/d/e/1FAIpQLSfqDcg5zF1n9CUPFjfyRF5nUOg2smvihvUmh_47LStyPZ2viQ/formResponse', {
      form: true,
      method: 'POST',
      body: ctx.request.body.fields || ctx.request.body
    })

    ctx.body = response.body
  }
]))

router.post('/api/vote', compose([
  body({multipart: true}),
  async ctx => {
    const response = await got('https://docs.google.com/forms/u/1/d/e/1FAIpQLSd7Z39kG0Hm3FD3WNu5cTu3DIrMd7OPJXQvqF2eOjxMGKDplA/formResponse', {
      form: true,
      method: 'POST',
      body: ctx.request.body.fields || ctx.request.body
    })

    ctx.body = response.body
  }
]))

/**
 * Proxy calls to Twitter
 */

router.get('/api/twitter', async ctx => {
  const { hashtag } = ctx.query

  ctx.set('Cache-Control', `s-maxage=${60 * 60 * 24}, max-age=0`)
  ctx.type = 'application/json'

  /**
   * Get Application only access token
   */

  const token = await got(url.resolve(TWITTER_ENDPOINT, '/oauth2/token'), {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${TWITTER_BEARER_TOKEN}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: 'grant_type=client_credentials'
  }).then(response => JSON.parse(response.body).access_token)

  /**
   * Figure out what to fetch
   */

  let path
  if (hashtag) {
    const query = encodeURIComponent(hashtag.replace(/^#?/, '#'))
    path = `/1.1/search/tweets.json?count=12&q=${query}`
  } else {
    const user = encodeURIComponent(process.env.TWITTER_USERNAME)
    path = `/1.1/statuses/user_timeline.json?count=12&screen_name=${user}`
  }

  /**
   * Fetch tweets using access token
   */

  ctx.body = await got(url.resolve(TWITTER_ENDPOINT, path), {
    json: true,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(resp => resp.body.statuses ? resp.body.statuses : resp.body)
})

/**
 * Proxy calls to Instagram
 */

router.get('/api/instagram', async ctx => {
  const { hashtag } = ctx.query

  ctx.set('Cache-Control', `s-maxage=${60 * 60 * 24}, max-age=0`)
  ctx.type = 'application/json'

  /**
   * Figure out what to fetch
   */

  let path
  let endpoint

  if (hashtag) {
    path = `/explore/tags/${hashtag.replace(/^#?/, '')}/`
    endpoint = url.resolve(INSTAGRAM_SCRAPE_ENDPOINT, path)
  } else {
    path = `/v1/users/${INSTAGRAM_USER_ID}/media/recent?access_token=${INSTAGRAM_ACCESS_TOKEN}&count=${INSTAGRAM_COUNT}`
    endpoint = url.resolve(INSTAGRAM_ENDPOINT, path)
  }

  /**
   * Photos from our user are fetched from the API but photos from a hashtag has
   * to be scraped from a public Instagram feed.
   */

  ctx.body = await got(endpoint, { json: !hashtag }).then(response => {
    const result = []

    if (hashtag) {
      try {
        const json = JSON.parse(response.body.match(/<script type="text\/javascript">window\._sharedData = (.+?(?=;<\/script>))/)[1])
        json.entry_data.TagPage[0].graphql.hashtag.edge_hashtag_to_top_posts.edges.forEach(function (post) {
          if (result.length !== INSTAGRAM_COUNT) {
            result.push({
              url: `https://www.instagram.com/p/${post.node.shortcode}/`,
              imageSrc: post.node.thumbnail_src
            })
          }
        })
      } catch (error) {
        return []
      }
    } else {
      response.body.data.forEach(function (post) {
        result.push({
          url: post.link,
          imageSrc: post.images.low_resolution.url
        })
      })
    }

    return result
  })
})

module.exports = compose([router.routes(), router.allowedMethods()])
