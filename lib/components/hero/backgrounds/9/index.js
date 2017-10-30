const html = require('choo/html');
const component = require('fun-component');

module.exports = component(function background9() {
  return html`
    <div class="Hero-bg Hero9" id="hero-bg-9">
      <svg class="u-isHidden">
        <symbol viewBox="0 0 186 186" id="hero-9-turbine-blades">
          <g fill="none" fill-rule="evenodd">
            <path d="M.5.5h185v185H.5z"/>
            <path fill="#FFF" d="M89.652 89.958l-1.158-33.02 1.214-52.876 10.328 69.652-3.97 13.88-2.076 4.852m-.063 4.98L65.91 114.94l-46.4 25.386 55.157-43.77 14.006-3.502 5.24-.63m4.345-2.434l29.174 15.506 45.186 27.49-65.484-25.88-10.036-10.38-3.165-4.223"/>
            <circle fill="#FFF" cx="93" cy="93" r="7"/>
          </g>
        </symbol>

        <symbol viewBox="0 0 18 232" id="hero-9-turbine-pole">
          <path d="M.948 231.688L5.903 3.244l6.192-2.48 4.95 230.924" fill="#FFF" fill-rule="evenodd"/>
        </symbol>
      </svg>

      <div>
        <svg viewBox="0 0 50 50" class="Hero9-industryCloud Hero9-industryCloud--md Hero9-industryCloud--light"><circle r="25" cx="25" cy="25" fill="currentColor" /></svg>
        <svg viewBox="0 0 50 50" class="Hero9-industryCloud Hero9-industryCloud--sm"><circle r="25" cx="25" cy="25" fill="currentColor" /></svg>
        <svg viewBox="0 0 50 50" class="Hero9-industryCloud Hero9-industryCloud--md"><circle r="25" cx="25" cy="25" fill="currentColor" /></svg>
        <svg viewBox="0 0 50 50" class="Hero9-industryCloud Hero9-industryCloud--lg"><circle r="25" cx="25" cy="25" fill="currentColor" /></svg>
        <svg viewBox="0 0 141 97" class="Hero9-industryCloud Hero9-industryCloud--xl">
          <path d="M21.993 88.693c6.74 0 12.764-3.038 16.8-7.813 2.785 2.513 6.465 4.055 10.513 4.055 3.77 0 7.22-1.327 9.93-3.534.953 8.774 8.376 15.6 17.402 15.6 7.735 0 14.28-5.012 16.6-11.963 4.996 3.78 11.2 6.047 17.95 6.047 16.466 0 29.812-13.346 29.812-29.81 0-10.58-5.527-19.846-13.837-25.138.07-.68.113-1.368.113-2.07 0-10.714-8.69-19.4-19.405-19.4-3.6 0-6.954 1-9.842 2.704C93.308 7.125 82.978 0 70.958 0 59.97 0 50.4 5.958 45.226 14.804c-3.896-3.884-9.27-6.288-15.208-6.288-11.886 0-21.53 9.64-21.53 21.526 0 6.206 2.642 11.78 6.84 15.706C6.443 48.573 0 56.884 0 66.703c0 12.144 9.848 21.99 21.993 21.99z" fill="currentColor" fill-rule="evenodd"/>
        </svg>
        <svg viewBox="0 0 50 50" class="Hero9-industryCloud Hero9-industryCloud--md"><circle r="25" cx="25" cy="25" fill="currentColor" /></svg>
        <svg viewBox="0 0 50 50" class="Hero9-industryCloud Hero9-industryCloud--lg Hero9-industryCloud--light"><circle r="25" cx="25" cy="25" fill="currentColor" /></svg>
        <svg viewBox="0 0 50 50" class="Hero9-industryCloud Hero9-industryCloud--sm"><circle r="25" cx="25" cy="25" fill="currentColor" /></svg>
      </div>

      <svg class="Hero9-satellite" viewBox="0 0 86 56">
        <g stroke-width="3" stroke="#FFF" fill="none" fill-rule="evenodd">
          <rect fill="#fff" x="1.5" y="10.5" width="25" height="10" rx="2"/>
          <rect fill="#fff" x="59.5" y="10.5" width="25" height="10" rx="2"/>
          <path d="M27.5 15.5h5m22 0h5" stroke-linecap="square" />
          <path fill="#fff" d="M29 50c2.22-5.85 7.87-10 14.5-10 6.62 0 12.27 4.15 14.5 10H29z"/>
          <path d="M43.5 54.5v-4" stroke-linecap="round"/>
          <path d="M43.5 32.5v7" stroke-linecap="square" />
          <path fill="#fff" d="M39 1.5c-2.5 0-4.5 2-4.5 4.5v22c0 2.5 2 4.5 4.5 4.5h8c2.5 0 4.5-2 4.5-4.5V6c0-2.5-2-4.5-4.5-4.5h-8z"/>
        </g>
      </svg>

      <svg class="Hero9-tower" viewBox="0 0 62 300">
        <g fill="none" fill-rule="evenodd">
          <path fill="#FFF" fill-rule="nonzero" d="M28 63v237h5V63m2 0v237h3V63m2 0v237h3V63"/>
          <path d="M31.8 286.5h12.4m-12.4-54h12.4m-12.4-55h12.4m-12.4-54h12.4" stroke="#FFF" stroke-width="3" stroke-linecap="square"/>
          <path d="M13 85.7h34m-34-23h36" stroke="#FFF" stroke-width="2" stroke-linecap="square"/>
          <path d="M61.2 181c-7.4-.6-13.8-5.8-15.7-13.3-2-7.6 1.4-15.2 7.6-19l8.4 32.2z" fill="#FFF"/>
          <path d="M52.6 165.2l5-1.2" stroke="#FFF" stroke-width="3" stroke-linecap="round"/>
          <path d="M11 41.7h39" stroke="#FFF" stroke-width="2" stroke-linecap="square"/>
          <path fill="#FFF" d="M27 21h9v83h-9zm24-.2l9 .6-6 82.8-9-.6z"/>
          <path d="M31.5 23.2V1.8" stroke="#FFF" stroke-width="2" stroke-linecap="square"/>
          <path fill="#FFF" d="M0 21.4l9-.6 6 82.8-9 .6zM19 221h7v34h-7z"/>
        </g>
      </svg>

      <div>
        <svg viewBox="0 0 186 325" class="Hero9-industryTurbine">
          <g transform="translate(0 -68)">
            <use class="Hero9-industryBlades" xlink:href="#hero-9-turbine-blades" />
          </g>
          <use y="95" height="232" xlink:href="#hero-9-turbine-pole" />
        </svg>
        <svg viewBox="0 0 186 325" class="Hero9-industryTurbine">
          <g transform="translate(0 -68)">
            <use class="Hero9-industryBlades" xlink:href="#hero-9-turbine-blades" />
          </g>
          <use y="95" height="232" xlink:href="#hero-9-turbine-pole" />
        </svg>
      </div>
    </div>
  `;
});
