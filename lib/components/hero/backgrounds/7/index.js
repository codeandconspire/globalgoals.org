const html = require('choo/html');
const component = require('fun-component');

module.exports = component(function background7() {
  return html`
    <div class="Hero-bg Hero7" id="hero-bg-7">
      <dic class="Hero7-dimmer"></div>

      <svg class="u-isHidden">
        <symbol id="hero7-energy-turbine" viewBox="0 0 118 229">
          <g fill="#FFF" fill-rule="evenodd">
            <path d="M55 246.02l3.72-171.34.46-5.57 3.7-1.35.48 5.1 3.7 173.2"/>
            <path class="Hero7-energyBlades" d="M66.9 70.1c.06-.35.1-.72.1-1.1 0-.9-.2-1.78-.57-2.56l3.06-10.7L61.2 0l-.97 42.32L60.8 63c-2.74.08-5.02 2-5.65 4.55l-10.9 2.73L.12 105.3 37.26 85 56.6 73.1c1.1 1.16 2.67 1.9 4.4 1.9.74 0 1.46-.14 2.1-.38l7.14 7.36 52.4 20.72-36.16-22L66.9 70.1z"/>
          </g>
        </symbol>

        <symbol id="hero7-lightbulb" viewBox="0 0 70 452">
          <defs>
            <path id="a" d="M0 21.2V.05h31.03v42.3H0z"/>
          </defs>
          <g fill="none" fill-rule="evenodd">
            <g transform="rotate(-180 25.75 216.285)">
              <mask id="b" fill="#fff">
                <use xlink:href="#a"/>
              </mask>
              <path fill="#FFF" d="M15.58.05h-.1C6.9.05 0 7.05 0 15.73c0 2.6.62 5.04 1.73 7.2 1.1 2.9 3.24 5.07 4.44 10.18.6 2.6 1.68 7.1 1.68 7.1.48 2.2 2.4 2.2 2.4 2.2H20.8s1.9 0 2.4-2.2l1.67-7.04c1.2-5.1 3.35-7.28 4.44-10.16v-.03c1.1-2.15 1.78-4.6 1.78-7.2 0-8.7-6.97-15.7-15.47-15.7" mask="url(#b)"/>
            </g>
            <path fill="#FFF" d="M30.84 385.5h10.3c.8 0 1.43.65 1.43 1.45 0 .8-.64 1.46-1.43 1.46h-10.3c-.8 0-1.44-.6-1.44-1.4 0-.8.64-1.45 1.44-1.45"/>
            <path fill="#FFF" d="M30.84 381h10.3c.8 0 1.43.67 1.43 1.47 0 .8-.64 1.46-1.43 1.46h-10.3c-.8 0-1.44-.65-1.44-1.46 0-.8.64-1.46 1.44-1.46"/>
            <path fill="#FFF" d="M30.84 376.53h10.3c.8 0 1.43.65 1.43 1.46 0 .8-.64 1.4-1.43 1.4h-10.3c-.8 0-1.44-.66-1.44-1.46 0-.82.64-1.47 1.44-1.47"/>
            <path fill="#FFF" d="M39.8 374.72c-.6-1.56-2.07-2.67-3.8-2.67-1.76 0-3.24 1.1-3.82 2.67h7.6z"/>
            <g stroke="#FFF" stroke-width="3.3" stroke-linecap="round" class="Hero7-bulbRays">
              <path class="Hero7-lightRay" d="M57 404l7.5-4.3"/>
              <path class="Hero7-lightRay" d="M60.3 416.13l8.63.03"/>
              <path class="Hero7-lightRay" d="M56.82 428.07l7.48 4.34"/>
              <path class="Hero7-lightRay" d="M47.83 437.4L52 445"/>
              <path class="Hero7-lightRay" d="M35.32 440.92l-.03 8.64"/>
              <path class="Hero7-lightRay" d="M23.35 437.73l-4.2 7.55"/>
              <path class="Hero7-lightRay" d="M14 428.4l-7.5 4.3"/>
              <path class="Hero7-lightRay" d="M10.78 416.02L2.14 416"/>
              <path class="Hero7-lightRay" d="M14.18 403.68l-7.47-4.34"/>
            </g>
            <path stroke="#FFF" stroke-width="2" d="M36 0v369.16" stroke-linecap="square"/>
          </g>
        </symbol>
      </svg>

      <svg class="Hero7-building" viewBox="0 0 49 139">
        <g fill="#FFF" fill-rule="evenodd">
          <path d="M10.42 59.76l-3.77 1.32L27.45.44l5.94 2.02L14.5 57.3"/>
          <path d="M43.4 58.62c0 .63-.5 1.13-1.12 1.13H28.53c-.64 0-1.14-.5-1.14-1.13v-8.6c0-.62.5-1.13 1.1-1.13h13.7c.6 0 1.1.5 1.1 1.1v8.6zm0 15.9c0 .6-.5 1.1-1.12 1.1H28.53c-.64 0-1.14-.5-1.14-1.1v-8.6c0-.63.5-1.14 1.1-1.14h13.7c.6 0 1.1.5 1.1 1.13v8.6zm0 15.87c0 .6-.5 1.1-1.12 1.1H28.53c-.64 0-1.14-.5-1.14-1.1v-8.6c0-.7.5-1.2 1.1-1.2h13.7c.6 0 1.1.5 1.1 1.1v8.6zm0 15.8c0 .6-.5 1.1-1.12 1.1H28.53c-.64 0-1.14-.5-1.14-1.15v-8.6c0-.6.5-1.1 1.1-1.1h13.7c.6 0 1.1.5 1.1 1.12v8.6zm-21-50.7v19c0 .6-.5 1.1-1.12 1.1H7.52c-.63 0-1.14-.5-1.14-1.13v-2.4c0-.14.04-.3.1-.4.02-.06.02-.08.06-.14.03-.07.07-.1.1-.16.04 0 .1-.1.13-.1 1.76-2.54 9.7-12.3 13.03-16.4l.34-.4c.24-.3.6-.5 1-.5.64 0 1.15.48 1.27 1.08v.5zm-.02 34.8c0 .6-.5 1.1-1.13 1.1H7.48c-.62 0-1.13-.5-1.13-1.1v-8.6c0-.65.5-1.15 1.13-1.15h13.77c.62 0 1.13.5 1.13 1.12v8.6zm0 15.85c0 .63-.5 1.13-1.13 1.13H7.48c-.62 0-1.13-.5-1.13-1.13v-8.6c0-.6.5-1.1 1.13-1.1h13.77c.62 0 1.13.5 1.13 1.14v8.6zm7.18-64.56l.32-.4c3.1-3.98 8.34-10.4 10.9-13.54l.32-.4c.25-.3.6-.45 1.02-.45.63 0 1.14.45 1.26 1.05v14.5c0 .7-.56 1.27-1.26 1.3H30.6c-.7-.04-1.25-.6-1.25-1.3 0-.3.1-.57.26-.78zm19.1-31.2c-.15-.5-.6-.88-1.16-.88-.25 0-.47.1-.66.2l-.08.06-.4.5L1 67.8l-.2.28c-.24.24-.4.55-.4.9v70.58c0 .62.5 1.12 1.13 1.12h15.3v-22.4c0-.53.43-.95.96-.95h13.6c.5 0 .9.42.9.94v22.4h15.3c.6 0 1.1-.5 1.1-1.1V10.9c0-.17-.07-.33-.1-.47z"/>
        </g>
      </svg>

      <svg class="Hero7-energySun" viewBox="0 0 73 72">
        <g fill="none" fill-rule="evenodd">
          <path d="M36.5 15.54c-11.32 0-20.5 9.17-20.5 20.5 0 11.32 9.18 20.5 20.5 20.5S57 47.36 57 36.04c0-11.33-9.18-20.5-20.5-20.5" fill="#FFF"/>
          <g stroke="#FFF" stroke-width="3" stroke-linecap="round">
            <path class="Hero7-lightRay" d="M36.5 10.5v-9"/>
            <path class="Hero7-lightRay" d="M23.76 13.93l-4.5-7.82"/>
            <path class="Hero7-lightRay" d="M14.44 23.25l-7.82-4.5"/>
            <path class="Hero7-lightRay" d="M11.03 36H2"/>
            <path class="Hero7-lightRay" d="M14.44 48.72l-7.82 4.52"/>
            <path class="Hero7-lightRay" d="M23.76 58.05l-4.5 7.8"/>
            <path class="Hero7-lightRay" d="M36.5 61.46v9.03"/>
            <path class="Hero7-lightRay" d="M49.62 57.82l4.65 7.74"/>
            <path class="Hero7-lightRay" d="M58.78 48.34l7.9 4.37"/>
            <path class="Hero7-lightRay" d="M61.97 36H71"/>
            <path class="Hero7-lightRay" d="M58.56 23.25l7.82-4.5"/>
            <path class="Hero7-lightRay" d="M49.24 13.93l4.5-7.82"/>
          </g>
        </g>
      </svg>

      <div>
        <svg class="Hero7-energyTurbine"><use xlink:href="#hero7-energy-turbine" /></svg>
        <svg class="Hero7-energyTurbine"><use xlink:href="#hero7-energy-turbine" /></svg>
      </div>

      <div>
        <svg class="Hero7-lightbulb"><use xlink:href="#hero7-lightbulb" /></svg>
        <svg class="Hero7-lightbulb"><use xlink:href="#hero7-lightbulb" /></svg>
        <svg class="Hero7-lightbulb"><use xlink:href="#hero7-lightbulb" /></svg>
      </div>
    </div>
  `;
});
