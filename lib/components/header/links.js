const { routes, resolve } = require('../../params')
const { __ } = require('../../locale')

exports.primary = [
  state => ({
    title: __('The 17 Goals'),
    href: resolve(routes.home),
    isCurrent: state.routeName === 'home'
  }),
  state => state.lang === 'en' ? ({
    title: __('Action'),
    href: resolve(routes.activities),
    isCurrent: ['activities', 'activity'].includes(state.routeName)
  }) : null,
  state => state.lang === 'en' ? ({
    title: __('News'),
    href: resolve(routes.news),
    isCurrent: ['news', 'article'].includes(state.routeName)
  }) : null,
  state => state.lang === 'en' ? ({
    title: __('Resources'),
    href: resolve(routes.resources),
    isCurrent: state.routeName === 'resources'
  }) : null,
  state => state.lang === 'en' ? ({
    title: __('Schools'),
    href: 'http://worldslargestlesson.globalgoals.org',
    desc: 'World’s Largest Lesson',
    external: true
  }) : null
]

exports.secondary = [
  state => ({
    title: __('Press Releases'),
    href: '/press-releases'
  }),
  state => ({
    title: __('Partners'),
    href: '/partners'
  }),
  state => ({
    title: __('Project Everyone'),
    href: '/project-everyone'
  }),
  state => ({
    title: __('Contact us'),
    href: '/contact'
  })
]

exports.info = [
  state => ({
    title: __('Terms & Conditions'),
    href: '/terms'
  }),
  state => ({
    title: __('Privacy Policy'),
    href: '/privacy-policy'
  }),
  state => ({
    title: __('Anti-Corruption Policy'),
    href: '/anti-corruption-policy'
  }),
  state => ({
    title: __('Asset Licence'),
    href: '/asset-licence'
  })
]

exports.social = [
  state => ({
    title: __('Facebook'),
    name: 'facebook',
    href: 'https://www.facebook.com/globalgoals.org',
    desc: __('Stay in the loop and joing the discussion on Facebook'),
    image: {
      src: '/facebook.svg'
    }
  }),
  state => ({
    title: __('Twitter'),
    name: 'twitter',
    href: 'https://twitter.com/TheGlobalGoals',
    desc: __('Don\'t miss a heartbeat. Follow the Global Goals on Twitter'),
    image: {
      src: '/twitter.svg'
    }
  }),
  state => ({
    title: __('Instagram'),
    name: 'instagram',
    href: 'https://www.instagram.com/TheGlobalGoals/',
    desc: __('Stay up to date with the Global Goals progress on Facebook'),
    image: {
      src: '/instagram.svg'
    }
  }),
  state => ({
    title: __('YouTube'),
    name: 'youtube',
    href: 'https://www.youtube.com/channel/UCRfuAYy7MesZmgOi1Ezy0ng',
    desc: __('You will find all videos produced for Global Goals on the YouTube channel'),
    image: {
      src: '/youtube.svg'
    }
  })
]

exports.credits = [
  state => ({
    title: __('The United Nations'),
    role: __('In support of'),
    href: 'https://un.org',
    image: {
      src: '/un.svg',
      height: 32
    }
  }),
  state => ({
    title: __('Project Everyone'),
    role: __('Produced by'),
    href: 'https://project-everyone.org',
    image: {
      src: '/project-everyone.svg',
      height: 27
    }
  }),
  state => ({
    title: __('Getty Images'),
    role: __('Visual content partner'),
    href: 'http://gettyimages.com',
    image: {
      src: '/getty-images.svg',
      height: 18
    }
  }),
  state => ({
    title: __('The New Division'),
    role: __('Branding and design'),
    href: 'https://thenewdivision.world',
    image: {
      src: '/the-new-division.svg',
      height: 23
    }
  }),
  state => ({
    title: __('code&conspire'),
    role: __('Digital design and code'),
    href: 'https://codeandconspire.com',
    image: {
      src: '/codeandconspire.svg',
      height: 17
    }
  })
]
