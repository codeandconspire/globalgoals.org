const html = require('choo/html');
const component = require('fun-component');

module.exports = component({
  name: 'background-8',
  render() {
    return html`
      <div class="Hero-bg Hero8" id="hero-bg-8">
        <svg class="Hero8-bars" viewBox="0 0 391 329">
          <g fill-rule="evenodd">
            <g>
              <path class="Hero8-bar Hero8-bar--dark" d="M29 248h12c1.1 0 2 .9 2 2v79H27v-79c0-1.1.9-2 2-2z"/>
              <path class="Hero8-bar Hero8-bar--dark" d="M104 208h12c1.1 0 2 .9 2 2v119h-16V210c0-1.1.9-2 2-2z"/>
              <path class="Hero8-bar Hero8-bar--dark" d="M179 160h12c1.1 0 2 .9 2 2v167h-16V162c0-1.1.9-2 2-2z"/>
              <path class="Hero8-bar Hero8-bar--dark" d="M254 144h12c1.1 0 2 .9 2 2v183h-16V146c0-1.1.9-2 2-2z"/>
              <path class="Hero8-bar Hero8-bar--dark" d="M329 288h12c1.1 0 2 .9 2 2v39h-16v-39c0-1.1.9-2 2-2z"/>
            </g>
            <g>
              <path class="Hero8-bar Hero8-bar--light" d="M2 160h12c1.1 0 2 .9 2 2v167H0V162c0-1.1.9-2 2-2z"/>
              <path class="Hero8-bar Hero8-bar--light" d="M77 0h12c1.1 0 2 .9 2 2v327H75V2c0-1.1.9-2 2-2z"/>
              <path class="Hero8-bar Hero8-bar--light" d="M152 128h12c1.1 0 2 .9 2 2v199h-16V130c0-1.1.9-2 2-2z"/>
              <path class="Hero8-bar Hero8-bar--light" d="M227 104h12c1.1 0 2 .9 2 2v223h-16V106c0-1.1.9-2 2-2z"/>
              <path class="Hero8-bar Hero8-bar--light" d="M302 224h12c1.1 0 2 .9 2 2v103h-16V226c0-1.1.9-2 2-2z"/>
              <path class="Hero8-bar Hero8-bar--light" d="M377 296h12c1.1 0 2 .9 2 2v31h-16v-31c0-1.1.9-2 2-2z"/>
            </g>
          </g>
        </svg>
        <svg class="Hero8-curves" viewBox="0 0 615 236">
          <g fill-rule="evenodd">
            <path class="Hero8-curve" fill-opacity=".2" d="M436.58 236.17C371.18 185.84 343.5 135.6 274.16 136c-54.53.33-105.42 53.24-160.5 99.86l322.92.3z"/>
            <path class="Hero8-curve" fill-opacity=".2" d="M615 236V.03C488.42 2.3 425.25 215.33 325.68 236H615z"/>
            <path class="Hero8-curve" fill-opacity=".2" d="M352.27 235.92c-59.92-37.43-116.5-56.14-169.72-56.14-73.87 0-94.94 24.85-182.03 56.14h351.75z"/>
            <path class="Hero8-curve Hero8-curve--dark" d="M615 236l.4-36.8C520.94 136.9 494.8 46.66 404.65 60 308.08 74.3 278.67 190.2 156.1 236H615z"/>
          </g>
        </svg>
      </div>
    `;
  }
});
