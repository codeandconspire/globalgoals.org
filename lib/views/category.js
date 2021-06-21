const html = require('choo/html')
const Component = require('nanocomponent')
const view = require('../components/view')
const error = require('../components/error/404')
const Category = require('../components/form/category')
const nominees = require('../components/form/nominees.json')

module.exports = class Home extends Component {
  constructor (id, state, emit) {
    super(id)
    this.data = {}
    this.error = null
    const createElement = view(id, this.view.bind(this))
    this.createElement = function (state, emit, render) {
      if (!/^\/(progress|changemaker|campaign|summary)/.test(state.href)) return error()
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

    if (state.params.category === 'summary') {
      console.log('1', nominees)
      const responses = Object.keys(nominees).map((key) => {
        console.log('2', nominees[key].id)
        return this.data[nominees[key].id]
      }).filter(Boolean)
      console.log('3', responses)

      // if (responses.length !== 3) {
      //   throw new Error(`Missing ${3 - responses.length} responses`)
      // }
    }

    return html`
      <main class="View-main u-transformTarget">
        <style>
        .my-class { white-space: nowrap !important; margin-top: 22px !important; line-height: 1.4 !important; font-size: 7.5vw !important; }
        @media (min-width: 900px) {
          .my-class { font-size: 5.5vw !important; }
        }
        </style>
        <section class="View-section">
          ${state.params.category !== 'summary' ? html`
            <div class="Space Space--start">
              ${criteria(state.params.category)}
            </div>
          ` : null}
          ${this.error ? html`
            <div class="js-error">
              <div class="Space Space--end">
                <h2 class="Text-h3">Opps! Something went wrong.</h2>
                <p>${this.error.message}</p>
              </div>
            </div>
          ` : null}
          ${state.params.category === 'summary' ? html`
            <form class="Space Space--start" action="https://docs.google.com/forms/u/1/d/e/1FAIpQLSd7Z39kG0Hm3FD3WNu5cTu3DIrMd7OPJXQvqF2eOjxMGKDplA/formResponse" method="POST" onsubmit=${onsubmit}>
              ${Object.keys(this.data).map((key) => html`
                <input type="hidden" name="${key}" value="${this.data[key]}">
              `)}
              <div class="Text">
                <h2>Review your choices</h2>
                <p>Please review your choices and input your name before submitting.</p>
                <ol>
                  ${Object.keys(nominees).map((key) => html`
                    <li>${nominees[key].title}: <strong>${this.data[nominees[key].id]}</strong></li>
                  `)}
                </ol>
                <div class="Grid" style="margin-top: 40px;">
                  <div class="Grid-cell">
                    <label class="Form-field">
                      <span class="Form-label">Your name</span>
                      <input type="text" name="entry.956741974" oninput=${onchange} value="${this.data['entry.956741974'] || ''}" class="Form-control" required />
                    </label>
                  </div>
                  <div class="Grid-cell">
                    <button type="button" class="Button Button--secondary" onclick=${onback}>Go back</button>
                    <button type="submit" class="Button js-submit" style="margin-left: 16px;">Submit your vote</button>
                  </div>
                </div>
              </div>
            </form>
          ` : render(Category, state.params.category, this.data, render, onselect)}
        </section>
      </main>
    `

    function onchange (event) {
      if (event.target.type === 'checkbox') {
        if (!event.target.checked) delete self.data[event.target.name]
        else self.data[event.target.name] = event.target.value
      } else {
        console.log(event.target.value)
        self.data[event.target.name] = event.target.value
      }
      // self.rerender()
    }

    function onback (event) {
      window.history.back()
      event.preventDefault()
    }

    function onselect (props) {
      Object.assign(self.data, props)
      console.log('x', self.data, props)

      const next = {
        campaign: 'changemaker',
        changemaker: 'progress',
        progress: 'summary'
      }[state.params.category]

      emit('pushState', `/${next}`)
    }

    function onsubmit (event) {
      console.log('SUBMIT')
      if (typeof event.target.checkValidity !== 'function') return
      if (!event.target.checkValidity()) {
        event.target.reportValidity()
        event.preventDefault()
        return
      }

      const data = new window.FormData()
      Object.keys(self.data).forEach(function (key) {
        data.append(key, self.data[key])
      })

      document.querySelector('.js-submit').disabled = true
      console.log(data)
      window.fetch('/api/vote', {
        method: 'POST',
        credentials: 'include',
        body: data
      }).then(function (response) {
        console.log(response)
        if (!response.ok) throw new Error('Could not submit form')
        self.error = null
        emit('pushState', '/thanks')
      }).catch(function (err) {
        console.log(err)
        self.error = err
        self.rerender()
      })

      event.preventDefault()
    }
  }
}

function criteria (type) {
  switch (type) {
    case 'progress': return html`
      <div class="Text">
        <h3 class="Text-h4">Criteria for</h3>
        <h2 class="Text-h2 Text-marque u-bg6 my-class">Progress Award</h2>
        <p class="Text-large">The Global Goals Progress Award celebrates the achievement of an individual who is supporting progress for the Goals via a science, technology, digital or business led initiative.</p>
        <p>For this Award specifically, we are looking for individuals who:</p>
        <ul>
          <li>Have used science, technology, digital or business to develop a response to a challenge that has already seen measurable results.</li>
          <li>Have proven that their initiative has scalability and is a practical, cost-effective solution to a specific challenge.</li>
          <li>Have captured the attention of leaders in the specific field (science, technology, digital or business) and cultivated relevant partnerships to enable further development and innovation.</li>
        </ul>
      </div>
    `
    case 'changemaker': return html`
      <div class="Text">
        <h3 class="Text-h4">Criteria for</h3>
        <h2 class="Text-h2 Text-marque u-bg3 my-class">Changemaker Award</h2>
        <p class="Text-large">The Global Goals Changemaker Award celebrates the achievement of an individual who has inspired Goal related change using their personal experience or from a position of leadership.</p>
        <p>For this Award specifically, we are looking for individuals who:</p>
        <ul>
          <li>Have built an initiative that has used personal experience as a starting point and has already created change with the potential to scale up.</li>
          <li>Have become a spokesperson for change, gaining attention for both the challenge and the solution. The individual has shown personal bravery and resilience and in doing so has inspired others.</li>
          <li>Can demonstrate how they have captured the interest of those in positions of power or influence and/or developed relevant partnerships to support progress.</li>
        </ul>
      </div>
    `
    case 'campaign': return html`
      <div class="Text">
        <h3 class="Text-h4">Criteria for</h3>
        <h2 class="Text-h2 Text-marque u-bg10 my-class">Campaign Award</h2>
        <p class="Text-large">The Global Goals Campaign Award celebrates an individual or a group of people that has raised awareness or built a community in support of a Goal related cause, inspiring action and creating change.</p>
        <p><strong>For this Award specifically, we are looking for a group who:</strong></p>
        <ul>
          <li>Have garnered a substantial public following (online or offline) for their Goal related campaign and who have built strategic partnerships to further broaden reach.</li>
          <li>Have used their movement to get the attention of leaders with the authority to instigate change for the cause in question.</li>
          <li>Have used a range of platforms and/ or innovative ways to relay their message, mobilise an audience and inspire collective action.</li>
        </ul>
      </div>
    `
    default: throw new Error(`type ${type} not supported`)
  }
}
