const html = require('choo/html');
const { __ } = require('../../locale');

module.exports = function edit(id) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  return html`
    <a class="Edit" target="_blank" href="https://${ process.env.PRISMIC_REPOSITORY }.prismic.io/app/documents/${ id }/ref">
      ${ __('Edit') }
    </a>
  `;
};
