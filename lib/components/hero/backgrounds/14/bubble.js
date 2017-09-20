const html = require('choo/html');
const component = require('fun-component');

const SIZES = [ 'small', 'large' ];
const SPEEDS = [ 15000, 9000 ];

module.exports = function createBubble() {
  return component({
    name: 'background-14:bubble',
    load(element) {
      const replay = () => {
        element.classList.remove('in-transition');
        element.style.transitionDuration = null;
        window.setTimeout(() => {
          element.style.left = `${ Math.random() * 100 }%`;
          requestAnimationFrame(() => element.classList.add('in-transition'));
        }, Math.random() * 8000);
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
          transform: translateY(-${ this.origin }vh);
          left: ${ Math.random() * 100 }%;
        `;
      }

      return html`
        <div class="Hero14-bubble Hero14-bubble--${ this.size }" style="${ style }" id="hero-bubble-${ id }">
          <svg viewBox="0 0 32 32">
            <path fill="currentColor" fill-rule="evenodd" d="M16 32C7.16 32 0 24.84 0 16S7.16 0 16 0s16 7.16 16 16-7.16 16-16 16zM13.7 5.05c-1.6.5-3.08 1.35-4.42 2.5-1.35 1.16-2.4 2.5-3.17 4-.23.5-.03 1.1.46 1.34.5.23 1.1.03 1.34-.46.64-1.27 1.53-2.4 2.68-3.38 1.15-.98 2.4-1.7 3.73-2.12.54-.17.83-.73.66-1.26-.17-.53-.73-.82-1.26-.65z"/>
          </svg>
        </div>
      `;
    }
  });
};

function randomSize() {
  return SIZES[Math.floor(Math.random() * SIZES.length)];
}
