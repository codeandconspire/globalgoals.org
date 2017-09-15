const { resolve } = require('../../params');
const { __ } = require('../../locale');

module.exports = [
  state => ({
    title: __('The Goals'),
    href: resolve(state.routes.home, { referrer: state.params.referrer }),
    isCurrent: state.routeName === 'home'
  }),
  state => ({
    title: __('Initiatives'),
    href: resolve(state.routes.initiatives, { referrer: state.params.referrer }),
    isCurrent: ['initiatives', 'initiative'].includes(state.routeName)
  }),
  state => ({
    title: __('News'),
    href: resolve(state.routes.news, { referrer: state.params.referrer }),
    isCurrent: ['news', 'article'].includes(state.routeName)
  }),
  state => ({
    title: __('Resources'),
    href: '/todo',
    isCurrent: state.routeName === 'page'
  }),
  state => ({
    title: __('globalgoals.org'),
    href: 'http://globalgoals.org',
    external: true
  })
];
