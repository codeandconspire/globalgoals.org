const html = require('choo/html')
const Component = require('nanocomponent')
const Nominee = require('./nominee')
const nominees = require('./nominees.json')
const { className } = require('../base/utils')

module.exports = class Category extends Component {
  constructor (id) {
    super(id)
    this.error = null
    this.data = {}
  }

  static identity (type) {
    return `category-${type}`
  }

  update () {
    return true
  }

  createElement (type, render, onselect, onback) {
    const self = this
    const config = nominees[type]

    return html`
      <div>
        ${config.choices.map((props, index) => html`
          <div class="Space Space--start">
            ${render(Nominee, props, index)}
          </div>
        `)}

        <form class="Space Space--start" action="https://docs.google.com/forms/u/1/d/e/1FAIpQLSeZRxmFKW0Zz33Z1a_Fslzobu0of4QGYrNlpORO_y6jCtvoKg/formResponse" method="POST" onsubmit=${onsubmit}>
          <div class="Text Text--growing Text--full">
            <h2 class="Text-h3">Please make your selection for the ${config.title} Award</h2>
            <br>
          </div>
          <ol class="Grid">
            ${config.choices.map((props, index) => html`
              <li class="Grid-cell Grid-cell--sm1of2">
                <div class="Form-field">
                  <label class="Form-pair">
                    <input type="radio" name="${config.id}" value="${props.value}" required="required" class="Form-toggle" onchange=${onchange} checked="${this.data[config.id] === props.value}">
                    <span class="Form-label"><strong>#${index + 1}</strong> ${props.name}</span>
                  </label>
                </div>
              </li>
            `)}
          </ol>
          <div class="Grid" style="margin-top: 24px;">
            <div class="Grid-cell">
              <div class="Form-field">
                <label for="progress_motivation" class="Form-label">Please insert supporting comments here</label>
                <textarea oninput=${onchange} rows="5" id="progress_motivation" name="${config.comment}" class="Form-control">${this.data[config.comment] || ''}</textarea>
              </div>
            </div>
            <div class="Grid-cell">
              <button type="submit" class="${className('Button', {[`Button--${config.color}`]: config.color})} js-submit">${config.button}</button>
              ${onback ? html`
                <button type="button" class="Button Button--secondary" style="margin-left: 16px;" onclick=${onback}>Go back</button>
              ` : null}
            </div>
          </div>
        </form>
      </div>
    `

    function onchange (event) {
      if (event.target.type === 'checkbox') {
        if (!event.target.checked) delete self.data[event.target.name]
        else self.data[event.target.name] = event.target.value
      } else {
        self.data[event.target.name] = event.target.value
      }
      self.rerender()
    }

    function onsubmit (event) {
      if (typeof event.target.checkValidity !== 'function') return
      if (!event.target.checkValidity()) {
        event.target.reportValidity()
        event.preventDefault()
        return
      }

      self.error = null
      event.target.querySelector('.js-submit').disabled = true
      onselect(self.data)
      event.preventDefault()
    }
  }
}
