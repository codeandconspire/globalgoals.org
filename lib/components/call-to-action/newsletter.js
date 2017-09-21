const html = require('choo/html');
const { __ } = require('../../locale');

module.exports = function newlsetter(state) {
  return html`
    <form action="${ state.newsletterEndpoint }" method="POST">
      <input type="email" required />
      <button type="submit">${ __('Submit') }</button>
    </form>
  `;
};
