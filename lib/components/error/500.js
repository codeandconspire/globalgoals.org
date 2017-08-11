const html = require('choo/html');

module.exports = function view(error) {
  return html`
    <div class="u-textCenter">
      <p>
        <!-- TODO: Translate -->
        Something went catastrophically wrong
        <br />
        <small>${ error.message }</small>
        ${ process.env.NODE_ENV === 'development' && error.stack ? html`
          <pre class="u-textLeft">${ error.stack }</pre>
        ` : null }
      </p>
    </div>
  `;
};
