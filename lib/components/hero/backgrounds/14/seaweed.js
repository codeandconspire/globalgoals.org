const html = require('choo/html');
const component = require('fun-component');
const squiggles = require('./squiggles');

module.exports = component({
  name: 'background-14:seaweed',
  load(element) {
    const container = element.querySelector('.js-container');
    const paths = element.querySelectorAll('.js-path');

    for (let i = 0; i < paths.length; i += 1) {
      const from = squiggles(paths[i], 18, 2);
      const to = squiggles(paths[i], 18, 2, 1);

      const strand = html`
        <path fill="none" stroke="rgba(255, 255, 255, ${ (100 - (i * 10)) / 100 })" stroke-linecap="round" stroke-width="1.5" d="${ from }" />
      `;

      strand.appendChild(html`
        <animate attributeName="d" begin="0s" dur="${ i + 3 }s" repeatCount="indefinite" values="${ [ from, to, from ].join(';') }" />
      `);

      container.appendChild(strand);
    }
  },
  render() {
    return html`
      <div class="Hero-seaweed Hero-seaweed--squiggly">
        <svg viewBox="0 0 21 101" class="js-container">
          <path class="js-path" d="M8.5 93.5l-1-86"/>
          <path class="js-path" d="M14 93.5v-58"/>
          <path class="js-path" d="M8.5 93.5l5-71"/>
        </svg>
      </div>
    `;
  }
});
