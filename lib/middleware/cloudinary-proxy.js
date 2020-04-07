const https = require('https')
const Router = require('koa-router')
const compose = require('koa-compose')
const cloudinary = require('cloudinary')

const router = new Router()

cloudinary.config({
  secure: true,
  cloud_name: 'global-goals',
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

router.get('/images/:type/:transform/:uri(.+)', async function (ctx, next) {
  let { uri, type, transform } = ctx.params
  if (ctx.querystring) {
    uri = encodeURIComponent(`${uri}?${ctx.querystring}`)
  }

  try {
    const stream = await imageproxy(type, transform, uri)
    const headers = ['etag', 'last-modified', 'content-length', 'content-type']
    headers.forEach((header) => ctx.set(header, stream.headers[header]))
    ctx.set('Cache-Control', `public, max-age=${60 * 60 * 24 * 365}`)
    ctx.body = stream
  } catch (err) {
    ctx.throw(400, err)
  }
})

function imageproxy (type, transform, uri) {
  if (type === 'fetch' && !/^https?/.test(uri)) {
    uri = `https://globalgoals.cdn.prismic.io/globalgoals/${uri}`
  }

  return new Promise(function (resolve, reject) {
    const opts = { type: type, sign_url: true }
    if (transform) opts.raw_transformation = transform
    const url = cloudinary.url(uri, opts)

    const req = https.get(url, function onresponse (res) {
      if (res.statusCode >= 400) {
        const err = new Error(res.statusMessage)
        err.status = res.statusCode
        return reject(err)
      }
      resolve(res)
    })
    req.on('error', reject)
    req.end()
  })
}

module.exports = compose([router.routes(), router.allowedMethods()])
