const { resolve } = require('../../params');
const { __ } = require('../../locale');

module.exports = [
  state => ({
    title: __('The Goals'),
    href: resolve(state.routes.home, { referrer: state.params.referrer }),
    isCurrent: state.routeName === 'home'
  }),
  state => ({
    title: __('activities'),
    href: resolve(state.routes.activities, { referrer: state.params.referrer }),
    isCurrent: ['activities', 'activity'].includes(state.routeName)
  }),
  state => ({
    title: __('News'),
    href: resolve(state.routes.news, { referrer: state.params.referrer }),
    isCurrent: ['news', 'article'].includes(state.routeName)
  }),
  state => ({
    title: __('Resources'),
    href: resolve(state.routes.resources, { referrer: state.params.referrer }),
    isCurrent: state.routeName === 'resources'
  })
];
