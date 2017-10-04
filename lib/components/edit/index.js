const html = require('choo/html');
const { __ } = require('../../locale');

module.exports = function edit(state, doc = null) {
  if (!doc || (!state.isEditor && process.env.NODE_ENV !== 'development')) {
    return null;
  }

  return html`
    <a class="Edit" tabindex="-1" rel="noopener noreferrer"  target="_blank" href="https://${ process.env.PRISMIC_REPOSITORY }.prismic.io/app/documents/${ doc.id }/ref">
      ${ __('Edit') }
    </a>
  `;
};
