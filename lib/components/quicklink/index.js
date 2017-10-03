const html = require('choo/html');

module.exports = (content) => {
  return html`
    <div class="Space Space--contain Space--startTall">
      <div class="Text Text--wide">
        <h1 class="Text-h3 Text-decorative Text-marginBottomNone">${ content.title }</h1>
      </div>
      <div class="Text Text--wide">
        <div class="Text-h3 Text-lastMarginNone Text-firstMarginNone">${ content.body }</div>
      </div>
    </div>
  `;
};
