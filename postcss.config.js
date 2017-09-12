module.exports = (ctx) => ({
  map: ctx.options.map,
  plugins: [
    require('postcss-import')(),
    require('postcss-custom-media')(),
    require('postcss-selector-matches')(),
    require('postcss-custom-properties')(),
    require('postcss-url')([
      {filter: '**/*.woff', url: 'inline'},
      { url: 'copy', useHash: true }
    ]),
    require('postcss-flexbugs-fixes')(),
    require('autoprefixer')({browsers: [ 'last 2 versions', 'ie >= 9', 'Firefox ESR' ]}),
    require('postcss-csso')()
  ]
});
