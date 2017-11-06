const auth = require('koa-basic-auth')

exports.unauthorized = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (err.status === 401) {
      ctx.status = 401
      ctx.set('WWW-Authenticate', 'Basic')
      ctx.body = 'Try Again'
    } else {
      throw err
    }
  }
}

exports.auth = opts => auth(opts)
