const html = require('choo/html');
const component = require('fun-component');

const SIZES = [ 'sm', 'md', 'lg' ];

module.exports = component({
  name: 'background-6',
  load(element) {
    const height = element.offsetHeight;
    const drops = element.querySelectorAll('.js-drop');

    for (let i = 0; i < drops.length; i += 1) {
      const drop = drops[i];

      drop.addEventListener('transitionend', function ontransitionend() {
        drop.setAttribute('class', randomize());
        drop.style.left = `${ Math.random() * 100 }%`;
        drop.style.transform = null;
        drip(drop, 1000);
      });

      drip(drop, (i * 200) + (i > 3 ? (i * 100) : 0));
    }

    function drip(drop, delay = 0) {
      window.setTimeout(() => {
        drop.classList.add('in-transition');
        drop.style.transform = `translateY(calc(${ height }px + 100%))`;
      }, delay);
    }
  },
  render() {
    const drops = [];
    for (let i = 0; i < 8; i += 1) {
      drops.push(html`
        <svg class="${ randomize() }" style="left: ${ Math.random() * 100 }%;">
          <use href="#hero-drop-symbol" />
        </svg>
      `);
    }

    return html`
      <div class="Hero-background Hero-background--6">
        <svg class="u-hidden">
          <symbol viewBox="0 0 24 34" id="hero-drop-symbol">
            <path fill="currentColor" fill-rule="evenodd" d="M12 34c7.77 0 12-5.47 12-12.22C24 17.43 20.26 10.3 12.78.4c-.32-.43-.94-.5-1.37-.2l-.17.2C3.73 10.3 0 17.44 0 21.8 0 28.53 4.23 34 12 34z"/>
          </symbol>
        </svg>
        ${ drops }
      </div>
    `;
  }
});

function randomize() {
  const classNames = [ 'Hero-drop', 'js-drop' ];
  const size = SIZES[Math.floor(Math.random() * SIZES.length)];

  classNames.push(`Hero-drop--${ size }`);

  return classNames.join(' ');
}
