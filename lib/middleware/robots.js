const dedent = require('dedent');

module.exports = async function (ctx, next) {
  if (!ctx.url === '/robots.txt') { return next(); }

  ctx.body = dedent`
    User-agent: *
    Disallow: /
  `;
};
