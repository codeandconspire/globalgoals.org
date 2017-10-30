const { resolve } = require('../../params');
const { __ } = require('../../locale');

exports.primary = [
  state => ({
    title: __('The Goals'),
    href: resolve(state.routes.home, { referrer: state.params.referrer }),
    isCurrent: state.routeName === 'home'
  }),
  state => ({
    title: __('Activities'),
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

exports.secondary = [
  state => ({
    title: __('Press Releases'),
    href: resolve('press-releases', { referrer: state.params.referrer })
  }),
  state => ({
    title: __('Partners'),
    href: resolve('partners', { referrer: state.params.referrer })
  }),
  state => ({
    title: __('Project Everyone'),
    href: resolve('activities/project-everyone', { referrer: state.params.referrer })
  }),
  state => ({
    title: __('Contact us'),
    href: resolve('contact', { referrer: state.params.referrer })
  })
];

exports.info = [
  state => ({
    title: __('Terms & Conditions'),
    href: resolve('terms', { referrer: state.params.referrer })
  }),
  state => ({
    title: __('Privacy Policy'),
    href: resolve('privacy-policy', { referrer: state.params.referrer })
  }),
  state => ({
    title: __('Anti-Corruption Policy'),
    href: resolve('anti-corruption-policy', { referrer: state.params.referrer })
  }),
  state => ({
    title: __('Asset Licence'),
    href: resolve('asset-licence', { referrer: state.params.referrer })
  }),
  state => ({
    title: __('Partners'),
    href: resolve('partners', { referrer: state.params.referrer })
  })
];

exports.social = [
  state => ({
    title: __('Facebook'),
    href: 'https://www.facebook.com/globalgoals.org',
    image: {
      src: resolve('/facebook.svg')
    }
  }),
  state => ({
    title: __('Twitter'),
    href: 'https://twitter.com/TheGlobalGoals',
    image: {
      src: resolve('/twitter.svg')
    }
  }),
  state => ({
    title: __('Instagram'),
    href: 'https://www.instagram.com/TheGlobalGoals/',
    image: {
      src: resolve('/instagram.svg')
    }
  }),
  state => ({
    title: __('YouTube'),
    href: 'https://www.youtube.com/channel/UCRfuAYy7MesZmgOi1Ezy0ng',
    image: {
      src: resolve('/youtube.svg')
    }
  })
];

exports.credits = [
  state => ({
    title: __('The United Nations'),
    role: __('In support of'),
    href: 'https://un.org',
    image: {
      src: resolve('/un.svg'),
      height: 32
    }
  }),
  state => ({
    title: __('Project Everyone'),
    role: __('Produced by'),
    href: 'https://project-everyone.org',
    image: {
      src: resolve('/project-everyone.svg'),
      height: 27
    }
  }),
  state => ({
    title: __('Getty Images'),
    role: __('Visual content partner'),
    href: 'http://gettyimages.com',
    image: {
      src: resolve('/getty-images.svg'),
      height: 18
    }
  }),
  state => ({
    title: __('The New Division'),
    role: __('Brand design by'),
    href: 'https://thenewdivision.world',
    image: {
      src: resolve('/the-new-division.svg'),
      height: 23
    }
  }),
  state => ({
    title: __('Trollbäck+Company'),
    role: __('Icons and Logotype'),
    href: 'http://trollback.com',
    image: {
      src: resolve('/trollback.svg'),
      height: 10
    }
  }),
  state => ({
    title: __('code&conspire'),
    role: __('Digital Innovation by'),
    href: 'https://codeandconspire.com',
    image: {
      src: resolve('/codeandconspire.svg'),
      height: 19
    }
  })
];
