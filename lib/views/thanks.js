const html = require('choo/html')
const Component = require('nanocomponent')
const intro = require('../components/intro')
const view = require('../components/view')

module.exports = class Home extends Component {
  constructor (id, state, emit) {
    super(id)
    const createElement = view(id, this.view.bind(this))
    this.createElement = function (state, emit, render) {
      this.route = state.route
      return createElement(state, emit, render)
    }
  }

  static identity () {
    return 'home'
  }

  update () {
    return true
  }

  view (state, emit, render) {
    return html`
      <main class="View-main u-transformTarget">
        <section class="View-section">
          ${intro({
            title: 'Thank you',
            body: html`
              <div>
                <div class="Space Space--endShort">
                  <p>Your selections has been registered.<br>
                  We will let you know the outcome for each award as soon as possible.</p>
                </div>
              </div>
            `,
            pageIntro: true
          })}
        </section>
      </main>
    `
  }
}
