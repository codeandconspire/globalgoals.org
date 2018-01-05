const html = require('choo/html')
const Component = require('nanocomponent')

module.exports = class Background extends Component {
  constructor (id, state, emit, opts) {
    super(id)
    Object.assign(this, opts)
  }

  static identity (opts) {
    return `background-17${opts.tight ? '-tight' : ''}`
  }

  update () {
    return false
  }

  createElement () {
    return html`
      <div class="Hero-bg Hero17" id="hero-bg-17">
        <svg class="Hero17-web" viewBox="0 0 1442 802" width="1442" height="802" preserveAspectRatio="xMaxYMid slice">
          <g fill="none">
            <path class="Hero17-thread" stroke="#21608C" stroke-width="2" d="M1 441.6c113.1 118 198.8 237.7 257.1 359.4"/>
            <path class="Hero17-thread" stroke="#21608C" stroke-width="2" d="M1235.8 1c-350.2 165.6-608.5 432.3-775 800"/>
            <path class="Hero17-thread" stroke="#21608C" stroke-width="2" d="M713.1 1c220 214.2 367.1 480.9 441.6 800"/>
            <path class="Hero17-thread" stroke="#21608C" stroke-width="2" d="M521.9 801c-121-97.9-262.8-181.9-425.2-252"/>
            <path class="Hero17-thread" stroke="#21608C" stroke-width="2" d="M1441 573c-170.6 40.3-341.6 116.3-513 228"/>
            <path class="Hero17-thread" stroke="#21608C" stroke-width="2" d="M1441 366.3c-105.3 79.1-210.6 185.5-315.8 319.2"/>
            <path class="Hero17-thread" stroke="#21608C" stroke-width="2" d="M1441 229.3C905.7 176.3 425.7 233.6 1 401"/>
          </g>
          <g>
            <circle class="Hero17-node" fill="#21608C" cx="896" cy="214" r="8" />
            <circle class="Hero17-node" fill="#21608C" cx="476" cy="765" r="8" />
            <circle class="Hero17-node" fill="#21608C" cx="95" cy="548" r="8" />
            <circle class="Hero17-node" fill="#21608C" cx="1124" cy="687" r="8" />
          </g>
        </svg>
      </div>
    `
  }
}
