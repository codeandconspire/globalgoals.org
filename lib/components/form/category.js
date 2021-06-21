const html = require('choo/html')
const Component = require('nanocomponent')
const Nominee = require('./nominee')
const nominees = require('./nominees.json')
const { className } = require('../base/utils')

module.exports = class Category extends Component {
  constructor (id) {
    super(id)
    this.data = {}
  }

  static identity (type) {
    return `category-${type}`
  }

  update () {
    return true
  }

  createElement (type, data, render, onselect) {
    const self = this
    const config = nominees[type]
    data = Object.assign({}, data, this.data)

    return html`
      <div>
        ${config.choices.map((props, index) => html`
          <div class="Space Space--start">
            ${render(Nominee, type, props, config.theme, index)}
          </div>
        `)}

        <form class="Space Space--start" action="https://docs.google.com/forms/u/1/d/e/1FAIpQLScIgISLQXIsS-RxZ-n1yP9GET3IjKmvvtyfZ1rjxRU_Bk9EGQ/formResponse" method="POST" onsubmit=${onsubmit}>
          <div class="Text">
            <h2 class="Text-h3">Please make your selection for the ${config.title}</h2>
            <br>
            <ol class="Text-list Text-list--bare">
              ${config.choices.map((props, index) => html`
                <li class="Form-field">
                  <label class="Form-pair">
                    <input type="radio" name="${config.id}" value="${encodeURIComponent(props.value)}" required="required" class="Form-toggle" onchange=${onchange} checked="${data[config.id] === props.value}">
                    <span class="Form-label"><strong>Nominee ${index + 1}:</strong> ${props.value}</span>
                  </label>
                </li>
              `)}
            </ol>
            <div class="Grid" style="margin-top: 40px; margin-bottom: 4.5rem !important">
              <div class="Grid-cell">
                <div class="Form-field">
                  <label for="progress_motivation" class="Form-label">Please insert supporting comments here</label>
                  <textarea oninput=${onchange} rows="5" id="progress_motivation" name="${config.comment}" class="Form-control">${data[config.comment] || ''}</textarea>
                </div>
              </div>
              <div class="Grid-cell">
                <button type="button" class="Button Button--secondary" onclick=${onback}>Go back</button>
                <button type="submit" class="${className('Button', {[`u-bg${config.theme}`]: config.theme})} js-submit" style="margin-left: 16px;">${config.button.text}</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    `

    function onback (event) {
      window.history.back()
      event.preventDefault()
    }

    function onchange (event) {
      if (event.target.type === 'checkbox') {
        if (!event.target.checked) delete self.data[event.target.name]
        else self.data[event.target.name] = decodeURIComponent(event.target.value)
      } else {
        self.data[event.target.name] = decodeURIComponent(event.target.value)
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

      event.target.querySelector('.js-submit').disabled = true
      onselect(self.data)
      event.preventDefault()
    }
  }
}
