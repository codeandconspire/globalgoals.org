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
        <div class="Hero14-fish Hero14-fish--${ this.size }" style="${ style }" id="hero-fish-${ id }">
          <svg viewBox="0 0 87 39">
            <path d="M67.4 19.5H87C76.5 6.5 65.7 0 54.5 0S31.8 4.5 20 14c-2-4-5-7-8-9.6C9 2.2 5.3.8 1 .2.4.2 0 .4 0 .8v.5c2 3.3 3.2 6.3 4 9 1 3 1.6 6 2 9.2h53c-.7-1-1.2-2-1.2-3.2 0-2.8 2.4-5 5.3-5 3 0 5.4 2.2 5.4 5 0 1.2-.4 2.3-1 3.2H87C76.5 32.5 65.7 39 54.5 39S31.8 34.5 20 25c-2.2 3.8-5 7-8 9.5-3 2.3-6.6 3.7-11 4.3-.5 0-1-.2-1-.6v-.5c2-3.3 3.2-6.3 4-9 1-3 1.6-6 2-9.2h53c1 1.2 2.4 2 4 2 1.7 0 3.2-.8 4.2-2z" fill="currentColor" fill-rule="evenodd"/>
          </svg>
        </div>
      `;
    }
  });
};

function randomSize() {
  return SIZES[Math.floor(Math.random() * SIZES.length)];
}
