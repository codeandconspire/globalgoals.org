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
        <svg class="Hero17-web" viewBox="0 0 1440 800" preserveAspectRatio="xMaxYMid slice">
          <g fill="none" fill-rule="evenodd">
            <g>
              <circle class="Hero17-node" cx="897" cy="214" r="8" />
              <circle class="Hero17-node" cx="475" cy="763" r="8" />
              <circle class="Hero17-node" cx="98" cy="550" r="8" />
              <circle class="Hero17-node" cx="1124" cy="684" r="8" />
            </g>
            <g>
              <path class="Hero17-thread js-thread" d="M-202.553 256C-15.12 401.402 129.282 565.377 230.652 747.925c101.37 182.55 166.226 381.018 194.567 595.41" />
              <path class="Hero17-thread js-thread" d="M437.195 846.805c91.936-218.68 212.95-400.6 363.042-545.764C950.33 155.88 1125.25 41.866 1325-41" />
              <path class="Hero17-thread js-thread" d="M551.21-139.765C738.646 5.637 883.048 169.612 984.418 352.16c101.37 182.55 166.225 381.02 194.567 595.41" />
              <path class="Hero17-thread js-thread" d="M988.805 1438.805c-91.936-218.68-212.95-400.6-363.042-545.764C475.67 747.88 300.75 633.866 101 551" />
              <path class="Hero17-thread js-thread Hero17-thread--reverse" d="M1122.235 684.79c145.402-187.435 309.377-331.837 491.926-433.207 182.55-101.37 381.02-166.225 595.41-194.567" />
              <path class="Hero17-thread js-thread" d="M545.43 1161.553c145.403-187.433 309.38-331.835 491.927-433.205s381.018-166.226 595.41-194.567" />
              <path class="Hero17-thread js-thread Hero17-thread--reverse" d="M901.39 213.293c235.35-29.72 453.406-15.88 654.167 41.522 200.76 57.4 386.96 151.88 558.598 283.437" />
            </g>
          </g>
        </svg>
      </div>
    `
  }
}
