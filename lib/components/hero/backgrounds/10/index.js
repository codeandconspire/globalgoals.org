const html = require('choo/html');
const component = require('fun-component');

module.exports = component({
  name: 'background-10',
  load(element) {
    const boards = element.querySelectorAll('.js-board');
    const arm = element.querySelector('.js-scaleArm');
    const weights = element.querySelectorAll('.js-scaleWeight');

    element.addEventListener('transitionend', function ontransitionend() {
      element.removeEventListener('transitionend', ontransitionend);

      for (let i = 0; i < boards.length; i += 1) {
        tilt(boards[i], i % 2 ? 'right' : 'left');
      }

      tilt(arm, 'right');

      for (const weight of weights) {
        tilt(weight, 'right');
      }
    });

    element.classList.add('is-visible');
  },
  render() {
    return html`
      <div class="Hero-bg Hero-bg--10" id="hero-bg-10">
        <div class="Hero-board Hero-board--light js-board"></div>
        <div class="Hero-board Hero-board--dark js-board"></div>
        <div class="Hero-bend"></div>

        <svg class="Hero-scale" viewBox="0 0 182 133">
          <g fill="#FFF" fill-rule="evenodd">
            <g transform="translate(67)">
              <rect x="21" width="6" height="129" rx="1"/>
              <path d="M1 127h46c.6 0 1 .4 1 1v5H0v-5c0-.6.4-1 1-1z"/>
            </g>
            <g class="Hero-scaleArm js-scaleArm">
              <path d="M161 13c0 1.7-1.3 3-3 3H24c-1.7 0-3-1.3-3-3s1.3-3 3-3h134c1.7 0 3 1.3 3 3z"/>
              <path class="Hero-scaleWeight Hero-scaleWeight--left js-scaleWeight" d="M0 68.2c0-.5 0-1 .2-1.3l21-55 5.6 2c.3-1 .3-2 0-2l21 55c.2 0 .2 0 .2 1 0 12-10.8 22-24 22S0 80 0 68zM6.6 67h34.8L24 21.4 6.6 67zM24 10c.3 0 .7 0 1 .2.5.2.8.4 1 .7.4 0 .6 0 .8 1z" fill-rule="nonzero"/>
              <path class="Hero-scaleWeight Hero-scaleWeight--right js-scaleWeight" d="M134 68.2c0-.5 0-1 .2-1.3l21-55 5.6 2c.3-1 .3-2 0-2l21 55c.2 0 .2 0 .2 1 0 12-10.8 22-24 22s-24-10-24-22zm6.6-1.2h34.8L158 21.4 140.6 67zM158 10c.3 0 .7 0 1 .2.5.2.8.4 1 .7.4 0 .6 0 .8 1z" fill-rule="nonzero"/>
            </g>
          </g>
        </svg>
      </div>
    `;
  }
});

function tilt(element, direction = 'right', again = true) {
  element.addEventListener('transitionend', function ontransitionend() {
    element.removeEventListener('transitionend', ontransitionend);
    window.setTimeout(() => {
      element.classList.remove(`is-${ direction }Tilted`);
      if (again) {
        tilt(element, direction === 'right' ? 'left' : 'right', false);
      }
    }, 250);
  });

  element.classList.add(`is-${ direction }Tilted`);
}
