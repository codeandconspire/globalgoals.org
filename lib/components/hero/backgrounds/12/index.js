const html = require('choo/html');
const component = require('fun-component');

module.exports = component(function background12() {
  return html`
    <div class="Hero-bg Hero-bg--12" id="hero-bg-12">
      <div class="Hero-circleBox">
        <svg viewBox="0 0 630 630" class="Hero-circle">
          <g fill="none" fill-rule="evenodd" opacity=".4">
            <path stroke="#979797" d="M.5.5h629v629H.5z"/>
            <path fill="#5B3203" d="M563.8 119.6L496.5 161l75 45"/>
            <path fill="#5B3203" d="M347.2 627.3L344 550l-77.6 41.2"/>
            <path fill="#5B3203" d="M12 220.3l72.7 31-3-85.5"/>
            <path d="M315 593c8.7 0 17.4-.4 26-1.2 141.3-13 252-132 252-276.8 0-6.3-.2-12.5-.6-18.7m-47.6-137.8C494.8 85.2 410.5 37 315 37c-72.5 0-138.6 27.8-188 73.3m-66.4 92.5C45.4 237 37 275 37 315c0 105 58.2 196.3 144 243.7" stroke="#5B3203" stroke-width="19"/>
          </g>
        </svg>
      </div>
    </div>
  `;
});
