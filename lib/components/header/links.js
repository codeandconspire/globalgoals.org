const { routes } = require('../../params')
const { __ } = require('../../locale')

exports.primary = [
  state => ({
    title: __('The Goals'),
    href: routes.home,
    isCurrent: state.routeName === 'home'
  }),
  state => state.lang === 'en' ? ({
    title: __('Activities'),
    href: routes.activities,
    isCurrent: ['activities', 'activity'].includes(state.routeName)
  }) : null,
  state => state.lang === 'en' ? ({
    title: __('News'),
    href: routes.news,
    isCurrent: ['news', 'article'].includes(state.routeName)
  }) : null,
  state => state.lang === 'en' ? ({
    title: __('Resources'),
    href: routes.resources,
    isCurrent: state.routeName === 'resources'
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
    href: '/activities/project-everyone'
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
  }),
  state => ({
    title: __('Partners'),
    href: '/partners'
  })
]

exports.social = [
  state => ({
    title: __('Facebook'),
    href: 'https://www.facebook.com/globalgoals.org',
    image: {
      src: '/facebook.svg'
    }
  }),
  state => ({
    title: __('Twitter'),
    href: 'https://twitter.com/TheGlobalGoals',
    image: {
      src: '/twitter.svg'
    }
  }),
  state => ({
    title: __('Instagram'),
    href: 'https://www.instagram.com/TheGlobalGoals/',
    image: {
      src: '/instagram.svg'
    }
  }),
  state => ({
    title: __('YouTube'),
    href: 'https://www.youtube.com/channel/UCRfuAYy7MesZmgOi1Ezy0ng',
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
    role: __('Icons and Logotype'),
    href: 'https://thenewdivision.world',
    image: {
      src: '/the-new-division.svg',
      height: 23
    }
  }),
  state => ({
    title: __('code&conspire'),
    role: __('Digital Innovation by'),
    href: 'https://codeandconspire.com',
    image: {
      src: '/codeandconspire.svg',
      height: 17
    }
  })
]
