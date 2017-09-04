const html = require('choo/html');
const component = require('fun-component');

module.exports = component(function background(size = 'large') {
  return html`
    <div class="Hero-background Hero-background--1 Hero-background--${ size }">
    </div>
  `;
});
