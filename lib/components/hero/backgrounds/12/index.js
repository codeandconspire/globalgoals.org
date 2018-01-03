const html = require('choo/html')
const Component = require('nanocomponent')

module.exports = class Background extends Component {
  constructor (id, state, emit, opts) {
    super(id)
    Object.assign(this, opts)
  }

  static identity () {
    return 'background-12'
  }

  update () {
    return false
  }

  createElement () {
    return html`
      <div class="Hero-bg Hero12 ${this.tight ? 'Hero12--tight' : ''}" id="hero-bg-12">
        <div class="Hero12-circleBox">
          <svg viewBox="0 0 630 630" class="Hero12-circle">
            <g fill="none" fill-rule="evenodd">
              <path fill="currentColor" d="M563.8 119.6L496.5 161l75 45"/>
              <path fill="currentColor" d="M347.2 627.3L344 550l-77.6 41.2"/>
              <path fill="currentColor" d="M12 220.3l72.7 31-3-85.5"/>
              <path d="M315 593c8.7 0 17.4-.4 26-1.2 141.3-13 252-132 252-276.8 0-6.3-.2-12.5-.6-18.7m-47.6-137.8C494.8 85.2 410.5 37 315 37c-72.5 0-138.6 27.8-188 73.3m-66.4 92.5C45.4 237 37 275 37 315c0 105 58.2 196.3 144 243.7" stroke="currentColor" stroke-width="19"/>
            </g>
          </svg>
        </div>
      </div>
    `
  }
}
