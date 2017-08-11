const html = require('choo/html');

module.exports = function view(error) {
  return html`
    <div class="u-textCenter">
      <iframe src="https://giphy.com/embed/LGVQJ4cQGPs8o" width="480" height="352" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
      <p>
        <!-- TODO: Translate -->
        Something went wrong
        <br />
        <small>${ error.message }</small>
      </p>
    </div>
  `;
};
