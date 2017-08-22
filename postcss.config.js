module.exports = (ctx) => ({
  map: ctx.options.map,
  plugins: [
    require('postcss-import')(),
    require('postcss-custom-media')(),
    require('postcss-selector-matches')(),
    require('postcss-custom-properties')(),
    require('postcss-url')({ url: 'copy', useHash: true }),
    require('autoprefixer')(),
    require('postcss-csso')()
  ]
});
