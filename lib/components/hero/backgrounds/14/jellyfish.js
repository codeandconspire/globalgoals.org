const html = require('choo/html')
const component = require('fun-component')
const squiggles = require('./squiggles')

module.exports = component({
  name: 'background-14:jellyfish',
  load (element) {
    const paths = element.querySelectorAll('.js-path')
    const arms = element.querySelectorAll('.js-arm')

    for (let i = 0; i < paths.length; i += 1) {
      const from = squiggles(paths[i])
      const to = squiggles(paths[i], 15, 4, 1)

      arms[i].appendChild(html`
        <animate attributeName="d" begin="0s" dur="${i + 2.5}s" repeatCount="indefinite" values="${[ from, to, from ].join(';')}" />
      `)
    }

    element.addEventListener('transitionend', replay)
    replay()

    function replay () {
      element.classList.remove('in-transition')
      window.setTimeout(() => {
        element.style.left = `${Math.random() * 100}%`
        window.requestAnimationFrame(() => element.classList.add('in-transition'))
      }, Math.random() * (3500 - 1000) + 1000)
    }
  },
  render () {
    return html`
      <div class="Hero14-jellyfish">
        <svg viewBox="0 0 27 45">
          <g fill="none" fill-rule="evenodd">
            <path fill="#fff" d="M0 13.57c0 .3 0 .57.03.85l.05.52c0 .62.5 1.13 1.13 1.13h24.63c.55 0 .98-.4 1.1-.9l.07-.75.02-.85C27 6.07 20.96 0 13.5 0S0 6.08 0 13.57z"/>
            <path class="js-path" d="M19.5 15.54V43.5" />
            <path class="js-path" d="M13.5 15.54V43.5" />
            <path class="js-path" d="M7.5 15.54V43.5" />
            <path class="js-arm" stroke="#fff" stroke-linecap="round" stroke-width="1.5" d="M 19.5 15.54 Q 21.1764 22.53 19.5 29.52 Q 17.8236 36.51 19.5 43.5" />
            <path class="js-arm" stroke="#fff" stroke-linecap="round" stroke-width="1.5" d="M 13.5 15.54 Q 12.0764 22.53 13.5 29.52 Q 14.9236 36.51 13.5 43.5" />
            <path class="js-arm" stroke="#fff" stroke-linecap="round" stroke-width="1.5" d="M 7.5 15.54 Q 8.97642 22.53 7.5 29.52 Q 6.02358 36.51 7.5 43.5" />
          </g>
        </svg>
      </div>
    `
  }
})
