const html = require('choo/html')
const Component = require('nanocomponent')

module.exports = class Nominee extends Component {
  constructor (id) {
    super(id)
    this.expanded = false
  }

  static identity (props) {
    return `nominee-${props.value}-${props.name}`.replace(/\s+/g, '-').replace(/\W+/g, '').toLowerCase()
  }

  unload () {
    this.expanded = false
  }

  update () {
    return true
  }

  createElement (props, index) {
    const toggle = (event) => {
      this.expanded = !this.expanded
      this.rerender()
      event.preventDefault()
    }

    return html`
      <div>
        <div class="Text Text--full">
          <h3 class="Text-h4 u-color1">${props.category} Nomination #${index + 1}</h3>
          <h4 class="Text-h2" style="margin-top: 8px;">${props.name}</h4>
          <br>
          <img class="Text-image Text-image--left" src="${props.image}">
          <dl class="Text-marginTopNone" style="float: left;">
            <dt>Name</dt>
            <dd>${props.name}</dd>
            <dt>Company/Org.</dt>
            <dd>${props.org}</dd>
            <dt>Age</dt>
            <dd>${props.age}</dd>
            <dt>Country</dt>
            <dd>${props.country}</dd>
            <dt>Website</dt>
            <dd><a href="${props.website}" target="_blank" rel="noreferrer noopener">${props.website}</a></dd>
          </dl>
          <br>
        </div>
        ${this.expanded ? html`
          <div class="Text">
            <p>${props.body[0]}</p>
            ${props.body.slice(1).map((text) => html`<p class="Text-appear">${text}</p>`)}
            <dl class="Text-appear">
              ${Object.keys(props.links).map((key) => [
                html`<dt>${key}</dt>`,
                html`<dd><a href="${props.links[key].href}">${props.links[key].handle}</a></dd>`
              ])}
            </dl>
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
