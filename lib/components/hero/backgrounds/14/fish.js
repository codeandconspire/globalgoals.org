const html = require('choo/html');
const component = require('fun-component');

const SIZES = [ 'small', 'medium' ];
const SPEEDS = [ 45000, 35000, 25000 ];

module.exports = function createFish() {
  return component({
    name: 'background-14:fish',
    load(element) {
      const replay = () => {
        element.classList.remove('in-transition');
        element.style.transitionDuration = null;
        window.setTimeout(() => {
          element.style.bottom = `${ Math.random() * 100 }%`;
          requestAnimationFrame(() => {
            element.classList.add('in-transition');
          });
        }, Math.random() * 5000);
      };

      this.hasLoaded = true;
      element.addEventListener('transitionend', replay);
      element.classList.add('in-transition');
      Object.assign(element.style, {
        transform: null,
        transitionDuration: `${ SPEEDS[SIZES.indexOf(this.size)] * ((100 - this.origin) / 100) }ms`
      });
    },
    unload() {
      this.hasLoaded = false;
    },
    render(id) {
      let style = '';

      this.size = randomSize();

      if (!this.hasLoaded) {
        this.origin = Math.random() * 100;
        style = `
          transform: translateX(${ this.origin }vw);
          bottom: ${ Math.random() * 100 }%;
        `;
      }

      return html`
        <div class="Hero-fish Hero-fish--${ this.size }" style="${ style }" id="hero-fish-${ id }">
          <svg viewBox="0 0 87 39">
            <path fill="currentColor" fill-rule="evenodd" d="M67.37 19.5H87C76.53 6.6 65.7.1 54.5 0 43.3-.1 31.8 4.54 20.1 13.94c-2.28-3.76-5-6.9-8.2-9.43C9.04 2.3 5.37.8.88.2.48.12.08.4 0 .83c0 .16.02.32.1.46 1.76 3.2 3.07 6.2 3.95 8.9.98 3.03 1.6 6.1 1.8 9.2H59.2c-.72-.9-1.15-2-1.15-3.2 0-2.85 2.35-5.1 5.25-5.1s5.25 2.25 5.25 5.1c0 1.2-.43 2.3-1.16 3.2H87C76.53 32.4 65.7 38.9 54.5 39c-11.2.1-22.68-4.54-34.4-13.94-2.28 3.76-5 6.9-8.2 9.43-2.87 2.2-6.54 3.7-11.03 4.3-.4 0-.8-.3-.86-.7 0-.2.1-.3.1-.5 1.8-3.27 3.1-6.27 4-8.97 1-3.1 1.6-6.16 1.8-9.24h53.3c1 1.17 2.5 1.92 4.1 1.92 1.7 0 3.2-.78 4.1-1.95z"/>
          </svg>
        </div>
      `;
    }
  });
};

function randomSize() {
  return SIZES[Math.floor(Math.random() * SIZES.length)];
}
