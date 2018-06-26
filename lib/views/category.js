const html = require('choo/html')
const Component = require('nanocomponent')
const view = require('../components/view')
const error = require('../components/error/404')
const Category = require('../components/form/category')

module.exports = class Home extends Component {
  constructor (id, state, emit) {
    super(id)
    this.data = {}
    this.error = null
    const createElement = view(id, this.view.bind(this))
    this.createElement = function (state, emit, render) {
      if (!/^\/(progress|changemaker|campaign)/.test(state.href)) return error()
      this.route = state.route
      return createElement(state, emit, render)
    }
  }

  static identity () {
    return 'category'
  }

  update () {
    return true
  }

  view (state, emit, render) {
    const self = this

    return html`
      <main class="View-main u-transformTarget">
        <section class="View-section">
          <div class="Space Space--start">
            ${criteria(state.params.category)}
          </div>
          ${this.error ? html`
            <div class="js-error">
              <div class="Space Space--end">
                <h2 class="Text-h3">Opps! Something went wrong.</h2>
                <p>${this.error.message}</p>
              </div>
            </div>
          ` : null}
          ${render(Category, state.params.category, this.data, render, onselect)}
        </section>
      </main>
    `

    function onselect (props) {
      Object.assign(self.data, props)

      if (state.params.category === 'campaign') {
        const data = new window.FormData()
        Object.keys(self.data).forEach(function (key) {
          data.append(key, self.data[key])
        })

        window.fetch('/api/vote', {
          method: 'POST',
          credentials: 'include',
          body: data
        }).then(function (response) {
          if (!response.ok) throw new Error('Could not submit form')
          self.error = null
          emit('pushState', '/thanks')
        }).catch(function (err) {
          self.error = err
          self.rerender()
        })
      } else {
        const next = {
          progress: 'changemaker',
          changemaker: 'campaign'
        }[state.params.category]
        emit('pushState', `/${next}`)
      }
    }
  }
}

function criteria (type) {
  switch (type) {
    case 'progress': return html`
      <div class="Text">
        <h3 class="Text-h4">Criteria for</h3>
        <h2 class="Text-h2 Text-marque Text-marque--red" style="margin-top: 32px;">Progress Award</h2>
        <p class="Text-large">The Global Goals Progress Award celebrates the achievement of an individual who is supporting progress for the Goals via a science, technology, digital or business led initiative.</p>
        <p>For this award specifically, we are looking for individuals who:</p>
        <ul>
          <li>Have used science, technology, digital or business to develop a response to a challenge that has already seen measurable results.</li>
          <li>Have proven that their initiative has scalability and is a practical, cost-effective solution to a specific challenge.</li>
          <li>Have captured the a ention of leaders in the specific field (science, technology, digital or business) and cultivated relevant partnerships to enable further development and innovation.</li>
        </ul>
      </div>
    `
    case 'changemaker': return html`
      <div class="Text">
        <h3 class="Text-h4">Criteria for</h3>
        <h2 class="Text-h2 Text-marque Text-marque--blue" style="margin-top: 32px;">Changemaker Award</h2>
        <p class="Text-large">The Global Goals Progress Award celebrates the achievement of an individual who is supporting progress for the Goals via a science, technology, digital or business led initiative.</p>
        <p>For this award specifically, we are looking for individuals who:</p>
        <ul>
          <li>Have used science, technology, digital or business to develop a response to a challenge that has already seen measurable results.</li>
          <li>Have proven that their initiative has scalability and is a practical, cost-effective solution to a specific challenge.</li>
          <li>Have captured the a ention of leaders in the specific field (science, technology, digital or business) and cultivated relevant partnerships to enable further development and innovation.</li>
        </ul>
      </div>
    `
    case 'campaign': return html`
      <div class="Text">
        <h3 class="Text-h4">Criteria for</h3>
        <h2 class="Text-h2 Text-marque Text-marque--yellow" style="margin-top: 32px;">Campaign Award</h2>
        <p class="Text-large">The Global Goals Progress Award celebrates the achievement of an individual who is supporting progress for the Goals via a science, technology, digital or business led initiative.</p>
        <p>For this award specifically, we are looking for individuals who:</p>
        <ul>
          <li>Have used science, technology, digital or business to develop a response to a challenge that has already seen measurable results.</li>
          <li>Have proven that their initiative has scalability and is a practical, cost-effective solution to a specific challenge.</li>
          <li>Have captured the a ention of leaders in the specific field (science, technology, digital or business) and cultivated relevant partnerships to enable further development and innovation.</li>
        </ul>
      </div>
    `
    default: throw new Error(`type ${type} not supported`)
  }
}
