const { resolve } = require('../../params');
const { __ } = require('../../locale');

module.exports = [
  state => ({
    title: __('The Goals'),
    href: resolve(state.routes.home, { referrer: state.params.referrer }),
    isActive: state.routeName === 'home'
  }),
  state => ({
    title: __('Initiatives'),
    href: resolve(state.routes.initiatives, { referrer: state.params.referrer }),
    isActive: ['initiatives', 'initiative'].includes(state.routeName)
  }),
  state => ({
    title: __('News'),
    href: resolve(state.routes.news, { referrer: state.params.referrer }),
    isActive: ['news', 'article'].includes(state.routeName)
  }),
  state => ({
    title: __('Resources'),
    href: '/todo',
    isActive: state.routeName === 'page'
  })
];
