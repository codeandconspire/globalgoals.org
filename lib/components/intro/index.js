const html = require('choo/html');
const { __ } = require('../../locale');

module.exports = (opts) => {
  function title() {
    if (opts.loading) {
      return html`
        <h1 class="${ `Text-${ opts.large ? 'h1' : 'h2' }` }">
          <span class="u-loading">${ __('LOADING_TEXT_SHORT') }</span>
        </h1>
      `;
    } else {
      return html`
        <h1 class="${ `Text-${ opts.large ? 'h1' : 'h2' }` }">${ opts.title }</h1>
      `;
    }
  }

  function body() {
    if (opts.loading) {
      return html`
        <p><span class="u-loading">${ __('LOADING_TEXT_LONG') }</span></p>
      `;
    } else {
      return opts.body;
    }
  }

  return html`
    <div class="Space Space--textBlock">
      <div class="Text Text--growing ${ opts.center ? 'Text--center' : '' }">
        ${ opts.loading || opts.title ? title() : null }
        ${ opts.loading || opts.body ? body() : null }
        ${ opts.other ? opts.other : null }
      </div>
    </div>
  `;
};
