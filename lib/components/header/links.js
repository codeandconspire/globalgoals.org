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
    href: resolve(routes.action),
    isCurrent: state.routeName === 'action'
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
    title: __('Business'),
    href: 'https://business.globalgoals.org',
    inFooter: false
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

exports.partners = [
  state => ({
    title: __('Visit our friends'),
    href: '/partners'
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
    title: __('Cookies'),
    href: '/cookies'
  }),
  state => ({
    title: __('Anti-Corruption'),
    href: '/anti-corruption-policy'
  }),
  state => ({
    title: __('Asset Licence'),
    href: '/asset-licence'
  }),
  state => ({
    title: __('Open-source'),
    external: true,
    href: process.env.npm_package_homepage
  })
]

exports.social = [
  state => ({
    title: __('Facebook'),
    name: 'facebook',
    href: 'https://www.facebook.com/theglobalgoals',
    desc: __('Stay up to date with us on Facebook'),
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
    desc: __('See the world of The Global Goals on Instagram'),
    image: {
      src: '/instagram.svg'
    }
  }),
  state => ({
    title: __('YouTube'),
    name: 'youtube',
    href: 'https://www.youtube.com/channel/UCRfuAYy7MesZmgOi1Ezy0ng',
    desc: __('Watch our videos for The Global Goals on the YouTube channel'),
    image: {
      src: '/youtube.svg'
    }
  })
]

exports.credits = [
  state => ({
    title: __('Project Everyone'),
    role: __('Produced by'),
    href: 'https://project-everyone.org',
    image: {
      src: '/project-everyone.svg',
      height: 30
    }
  }),
  state => ({
    title: __('The New Division by Trollbäck + Company'),
    role: __('Branding and design'),
    href: 'https://thenewdivision.world',
    image: {
      src: '/the-new-division.svg',
      height: 26
    }
  }),
  state => ({
    title: __('code and conspire'),
    role: __('Code and digital design'),
    href: 'https://codeandconspire.com',
    image: {
      src: '/code-and-conspire.svg',
      height: 16
    }
  })
]
