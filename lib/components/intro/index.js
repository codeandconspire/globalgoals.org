const html = require('choo/html');
const { __ } = require('../../locale');

module.exports = (content = false) => {
  return html`
    <div class="View-intro">
      <div class="Text Text--growing">
        ${ !content ? html`
          <div>
            <h1 class="u-loading">${ __('LOADING_TEXT_SHORT') }</h1>
            <p>
              <span class="u-loading">${ __('LOADING_TEXT_LONG') }</span>
            </p>
          </div>
        ` : html`
          <div>
            <h1>${ content.title }</h1>
            <div>${ content.body }</div>
            ${ content.other }
          </div>
        `}
      </div>
    </div>
  `;
};
