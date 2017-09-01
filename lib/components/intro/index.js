const html = require('choo/html');
const { __ } = require('../../locale');

module.exports = (content = false) => {
  return html`
    <div class="View-intro">
      <div class="Text Text--growing">
        ${ !content ? html`
          <div>
            <h1 class="Text-marginTopNone">
              <span class="u-loading">${ __('LOADING_TEXT_SHORT') }</span>
            </h1>
            <div class="Text-lastMarginNone">
              <p>
                <span class="u-loading">${ __('LOADING_TEXT_LONG') }</span>
              </p>
            </div>
          </div>
        ` : html`
          <div>
            <h1 class="Text-marginTopNone">${ content.title }</h1>
            <div class="Text-lastMarginNone">${ content.body }</div>
            ${ content.other }
          </div>
        `}
      </div>
    </div>
  `;
};
