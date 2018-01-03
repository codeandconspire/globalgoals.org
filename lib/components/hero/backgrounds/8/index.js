const html = require('choo/html')
const Component = require('nanocomponent')

module.exports = class Background extends Component {
  constructor (id, state, emit, opts) {
    super(id)
    Object.assign(this, opts)
  }

  static identity () {
    return 'background-8'
  }

  update () {
    return false
  }

  createElement () {
    return html`
      <div class="Hero-bg Hero8 ${this.tight ? 'Hero8--tight' : ''}" id="hero-bg-8">
        <svg viewBox="0 0 418 277" width="418" height="265" class="Hero8-bars">
          <g fill="none" fill-rule="evenodd">
            <g>
              <path class="Hero8-bar Hero8-bar--dark" d="M179 142h12c1 0 2 1 2 2v133h-16V144c0-1 1-2 2-2z" />
              <path class="Hero8-bar Hero8-bar--dark" d="M104 125h12c1 0 2 1 2 2v150h-16V127c0-1 1-2 2-2z" />
              <path class="Hero8-bar Hero8-bar--dark" d="M254 134h12c1 0 2 1 2 2v141h-16V136c0-1 1-2 2-2z" />
              <path class="Hero8-bar Hero8-bar--dark" d="M329 86h12c1 0 2 1 2 2v190h-16V88c0-1 1-2 2-2z" />
              <path class="Hero8-bar Hero8-bar--dark" d="M404 41h12c1 0 2 1 2 2v234h-16V43c0-1 1-2 2-2z" />
              <path class="Hero8-bar Hero8-bar--dark" d="M29 185h12c1 0 2 1 2 2v90H27v-90c0-1 1-2 2-2z" />
            </g>
            <g>
              <path class="Hero8-bar Hero8-bar--light" d="M2 237h12c1 0 2 1 2 2v39H0v-39c0-1 1-2 2-2z" />
              <path class="Hero8-bar Hero8-bar--light" d="M77 96h12c1 0 2 1 2 2v179H75V98c0-1 1-2 2-2z" />
              <path class="Hero8-bar Hero8-bar--light" d="M152 109h12c1 0 2 1 2 2v167h-16V111c0-1 1-2 2-2z" />
              <path class="Hero8-bar Hero8-bar--light" d="M227 22h12c1 0 2 1 2 2v253h-16V24c0-1 1-2 2-2z" />
              <path class="Hero8-bar Hero8-bar--light" d="M302 73h12c1 0 2 1 2 2v202h-16V75c0-1 1-2 2-2z" />
              <path class="Hero8-bar Hero8-bar--light" d="M377 1h12c1 0 2 .8 2 2v274h-16V3c0-1.2 1-2 2-2z" />
            </g>
          </g>
        </svg>
        <svg viewBox="0 0 628 236" width="628" height="236" class="Hero8-curves">
          <g fill="none" fill-rule="evenodd">
            <path class="Hero8-curve" d="M180 236c65-50.2 92.7-100.4 161.8-100 54.4.3 105.2 53.5 160 100H180z" fill-opacity=".2" fill="#FFF"/>
            <path class="Hero8-curve" d="M263.7 236c61.2-39.8 117.8-58.5 169.7-56.2 78 3.5 96.7 23 193.8 56.2H263.7z" fill-opacity=".2" fill="#FFF"/>
            <path class="Hero8-curve" d="M0 236C-1.5 78.8-1.5.2 0 .3c121.4 8.3 151.8 165 304.6 235.7H0z" fill-opacity=".2" fill="#FFF"/>
            <path class="Hero8-curve Hero8-curve--dark" d="M0 236v-36.2C95.2 137.5 121 46.6 211.4 60c96.8 14.3 126 130.5 249.7 176 4.5 1.6-149.2 1.6-461 0z" />
          </g>
        </svg>
      </div>
    `
  }
}
