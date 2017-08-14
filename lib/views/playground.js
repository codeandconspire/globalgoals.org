const html = require('choo/html');
const view = require('../components/view');

module.exports = view(playground);

function playground(state, emit) {
  const { referrer } = state.params;

  return html`
    <div class="View-section">
      <div class="Text">
        <h1>The Global Goals</h1>
        <h2>The Global Goals</h2>
        <h3>The Global Goals</h3>
        <h4>The Global Goals</h4>
        <h5>The Global Goals</h5>
        <p class="Text-preamble">Preamble. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore</p>
        <p>Paragraph. Magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <ul>
          <li>Vem</li>
          <li>Mördade</li>
          <li>Palme</li>
        </ul>
        <p>Paragraph. <strong>Got some bold text in here, did not see that comming did you?</strong>. Duis aute irure dolor in <em>reprehenderit in voluptate velit esse cillum</em> dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <ol>
          <li>One</li>
          <li>Two</li>
          <li>Delta</li>
        </ol>
        <blockquote>
          <p>Block quote! Culpa qui officia deserunt mollit anim id est laborum.</p>
        </blockquote>
      </div>
    </div>
  `;
}
