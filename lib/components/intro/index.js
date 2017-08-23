const html = require('choo/html');
const { __ } = require('../../locale');

module.exports = (content = false) => {
  return html`
    <div class="View-intro">
      <div class="Text Text--growing">
        ${ !content ? html`
          <div>
            <h1 class="u-textLoading">${ __('Loading') }</h1>
            <div class="u-descendantsTextLoading">
              <span>${ __('LOADING_TEXT_LONG') }</span>
            </div>
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
