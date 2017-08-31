const html = require('choo/html');

module.exports = (content) => {
  return html`
    <section class="View-section">
      <div class="View-article">
        <div class="Text Text--wide">
          <h1 class="Text-h3 Text-muted">${ content.title }</h1>
        </div>
        <div class="Text Text--wide">
          <div class="Text-h3">${ content.body }</div>
        </div>
      </div>
    </section>
  `;
};
