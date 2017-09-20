const { resolve } = require('../../params');
const { __ } = require('../../locale');

module.exports = [
  state => ({
    title: __('The Goals'),
    href: resolve(state.routes.home, { referrer: state.params.referrer }),
    isCurrent: state.routeName === 'home'
  }),
  state => ({
    title: __('About'),
    href: '/about',
    isCurrent: state.routeName === 'page'
  }),
  state => ({
    title: __('globalgoals.org'),
    href: 'http://globalgoals.org',
    external: true
  })
];
