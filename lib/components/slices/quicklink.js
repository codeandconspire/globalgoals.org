const html = require('choo/html')

module.exports = (content) => {
  return html`
    <div class="Space Space--textBlock">
      <div class="Text Text--compact Text--wide">
        <h1 class="Text-h3 Text-decorative">${content.title}</h1>
        <div class="Text-h3">${content.body}</div>
      </div>
    </div>
  `
}
