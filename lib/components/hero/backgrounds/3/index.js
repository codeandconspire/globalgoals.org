const html = require('choo/html');
const component = require('fun-component');

module.exports = component({
  name: 'background-3',
  load(element) {
    const lifepath = element.querySelector('.js-lifepath');
    const hearts = element.querySelectorAll('.js-heart');

    hearts[0].addEventListener('animationend', pophearts);
    lifepath.addEventListener('animationend', onpathend);
    lifepath.classList.add('in-transition');
    pophearts();

    function onpathend() {
      const isEmpty = lifepath.classList.contains('in-reverse');
      window.setTimeout(() => {
        lifepath.classList[isEmpty ? 'remove' : 'add']('in-reverse');
      }, isEmpty ? 400 : 1000);
    }

    function pophearts() {
      const center = [ Math.random() * 100, Math.random() * 100 ];
      for (let i = 0; i < hearts.length; i += 1) {
        hearts[i].classList.remove('is-visible');
        const direction = i % 2 ? '+' : '-';
        Object.assign(hearts[i].style, {
          left: `calc(${ center[0] }% ${ direction } ${ Math.random() * (60 - 20) + 20 }px)`,
          top: `calc(${ center[1] }% ${ direction } ${ Math.random() * (60 - 20) + 20 }px)`
        });
        window.setTimeout(() => {
          hearts[i].classList.add('is-visible');
        }, 2000 + (Math.random() * (400 - 200) + 200));
      }
    }
  },
  render() {
    return html`
      <div class="Hero-background Hero-background--3">
        <div class="Hero-heart js-heart">
          <svg width="43" height="40" viewBox="0 0 43 40">
            <path d="M43 13c0 3.6-1.4 6.8-3.7 9.2L21.5 40 3.7 22C1.4 20 0 16.7 0 13 0 5.8 5 0 11.8 0c3.5 0 7.4 3.8 9.7 6.2C23.8 3.8 28 0 31.5 0 38.5 0 43 5.8 43 13z" fill="#0D3B06" fill-rule="evenodd"/>
          </svg>
        </div>
        <div class="Hero-heart js-heart">
          <svg width="43" height="40" viewBox="0 0 43 40">
            <path d="M43 13c0 3.6-1.4 6.8-3.7 9.2L21.5 40 3.7 22C1.4 20 0 16.7 0 13 0 5.8 5 0 11.8 0c3.5 0 7.4 3.8 9.7 6.2C23.8 3.8 28 0 31.5 0 38.5 0 43 5.8 43 13z" fill="#0D3B06" fill-rule="evenodd"/>
          </svg>
        </div>
        <svg class="Hero-lifeline" viewBox="0 0 1346 178">
          <path class="Hero-lifepath js-lifepath" d="M3 106h806l22.4-50.5 11 75.7 28-49 15.6 93L938.4 3l51 103H1363" stroke-width="5" stroke="#FFF" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    `;
  }
});
