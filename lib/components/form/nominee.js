const html = require('choo/html')
const Component = require('nanocomponent')

module.exports = class Nominee extends Component {
  constructor (id) {
    super(id)
    this.expanded = false
  }

  static identity (type, props) {
    return `nominee-${props.value}-${props.name}`.replace(/\s+/g, '-').replace(/\W+/g, '').toLowerCase()
  }

  unload () {
    this.expanded = false
  }

  update () {
    return true
  }

  createElement (category, props, theme, index) {
    category = category[0].toUpperCase() + category.substr(1)
    const toggle = (event) => {
      this.expanded = !this.expanded
      this.rerender()
      event.preventDefault()
    }

    return html`
      <div>
        <div class="Text">
          <h3 class="Text-h4 u-color${theme}">${category} Nomination #${index + 1}</h3>
          <h4 class="Text-h2" style="margin-top: 8px;">${props.title || props.value}</h4>
          <br>
        </div>
        <div class="Text Text--full u-cf">
          <img width="400" height="225" class="Text-image Text-image--left" src="https://ik.imagekit.io/ryozgj42m/tr:q-85,pr-true/${props.image}" style="width: 400px;">
          <dl class="Text-marginTopNone" style="float: left;">
            ${Object.keys(props.attributes).map((key) => [
              html`<dt>${key}</dt>`,
              html`<dd>${props.attributes[key].href ? html`
                <a href="${props.attributes[key].href}" target="_blank" rel="noreferrer noopener">${props.attributes[key].text}</a>
              ` : props.attributes[key]}</dd>`
            ])}
          </dl>
          <br>
        </div>
        ${this.expanded ? html`
          <div class="Text">
            <p>${props.body[0]}</p>
            ${props.body.slice(1).map((text) => html`<p class="Text-appear">${text}</p>`)}
            <button class="Button Button--secondary" onclick=${toggle}>Show less</button>
          </div>
        ` : html`
          <div class="Text">
            <p>${props.body[0].split(' ').reduce((text, word) => {
              if (text.length >= 240) return text
              return text + ' ' + word
            }, '')}…</p>
            <button class="Button Button--secondary" onclick=${toggle}>More information</button>
          </div>
        `}
      </div>
    `
  }
}
