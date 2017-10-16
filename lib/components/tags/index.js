const html= require('choo/html');

/**
 * Create list of tags layed out in grid formation
 * @param {array<mixed>} items List of objects or strings (max 4)
 * @return {Element}
 */

module.exports = function tags(items) {
  return html`
    <div class="Tags">
      ${ items.slice(0, 4).map(item => item.href ? html`
        <a href="${ item.href }" class="Tags-item u-bg${ item.number }">${ item.number }</a>
      ` : html`
        <span class="Tags-item u-bg${ item.number || item }">${ item.number || item }</span>
      `) }
    </div>
  `;
};

