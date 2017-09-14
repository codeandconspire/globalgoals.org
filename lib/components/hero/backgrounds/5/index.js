const html = require('choo/html');
const component = require('fun-component');

module.exports = component(function background5() {
  return html`
    <div class="Hero-background Hero-background--5" id="hero-bg-5">
      <svg class="Hero-people" viewBox="0 0 523 182" xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs>
          <pattern id="hero-stripe-pattern" x="7" y="7" width="6" height="200" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
            <rect class="Hero-stripe" x="0" y="0" width="3" height="200" />
          </pattern>
          <path id="hero-patriarch-a" d="M0 0h1c8.6 0 15.5 7 15.5 15.4 0 8.5-7 15.4-15.5 15.4H0V0zm0 107.5c2.2 0 2.4 1.8 2.5 2.5v63.4c0 4.7 4 8.6 8.7 8.6 4.8 0 8.6-4 8.6-8.6v-110c0-1.2.5-3 2.2-3 2.6 0 3 1.8 3 3.2v36.7c0 3.3 2.7 6 6 6s6-2.7 6-6V57.7c0-11-8.2-19.7-18.8-20.7H0v70.5z"/>
          <path id="hero-patriarch-b" d="M.7 0h.8C8 0 13.2 5.2 13.2 11.6 13.2 18 8 23.2 1.5 23.2H.7V0zm0 81c1.7 0 2 1.3 2 1.8v47.7c0 3.6 2.8 6.5 6.5 6.5 3.6 0 6.5-3 6.5-6.5V47.7c0-1 .3-2.2 1.7-2.2 2 0 2.2 1.4 2.2 2.4v27c0 2 2 4 4.6 4 2.5 0 4.5-2 4.5-4.8V43c0-8-6.2-14.6-14.2-15.3H.7v53z"/>
          <path id="hero-patriarch-c" d="M.7 0h.8C8 0 13.2 5.2 13.2 11.6 13.2 18 8 23.2 1.5 23.2H.7V0zm0 81c1.7 0 2 1.3 2 1.8v47.7c0 3.6 2.8 6.5 6.5 6.5 3.6 0 6.5-3 6.5-6.5V47.7c0-1 .3-2.2 1.7-2.2 2 0 2.2 1.4 2.2 2.4v27c0 2 2 4 4.6 4 2.5 0 4.5-2 4.5-4.8V43c0-8-6.2-14.6-14.2-15.3H.7v53z"/>
          <path id="hero-patriarch-d" d="M.8 0h.5c5 0 9 4 9 8.7 0 4.8-4 8.8-9 8.8H.8V0zm0 60.8c1.2 0 1.4 1 1.4 1.5V98c0 2.8 2.2 5 5 5 2.6 0 4.8-2.2 4.8-5V36c0-.8.3-1.8 1.3-1.8 1.4 0 1.6 1 1.6 1.8v20.8c0 1.8 1 3.4 3 3.4s3-1.6 3-3.4V32.5c0-6-5-11-11-11.5H1v39.8z"/>
          <path id="hero-patriarch-e" d="M.8 0h.5c5 0 9 4 9 8.7 0 4.8-4 8.8-9 8.8H.8V0zm0 60.8c1.2 0 1.4 1 1.4 1.5V98c0 2.8 2.2 5 5 5 2.6 0 4.8-2.2 4.8-5V36c0-.8.3-1.8 1.3-1.8 1.4 0 1.6 1 1.6 1.8v20.8c0 1.8 1 3.4 3 3.4s3-1.6 3-3.4V32.5c0-6-5-11-11-11.5H1v39.8z"/>
        </defs>

        <g>
          <use xlink:href="#hero-patriarch-a" class="Hero-person Hero-person--striped" x="265"/>
          <use xlink:href="#hero-patriarch-b" class="Hero-person Hero-person--striped" x="399.268" y="45"/>
          <use xlink:href="#hero-patriarch-c" class="Hero-person Hero-person--striped" x="127.268" y="45"/>
          <use xlink:href="#hero-patriarch-d" class="Hero-person Hero-person--striped" x="501.22" y="79"/>
          <use xlink:href="#hero-patriarch-e" class="Hero-person Hero-person--striped" x="24.22" y="79"/>
        </g>

        <rect class="Hero-stripes" x="0" y="0" width="523" height="182" fill="url(#hero-stripe-pattern)" />
        <rect class="Hero-stripes" x="523" y="0" width="523" height="182" fill="url(#hero-stripe-pattern)" />

        <g>
          <g class="Hero-person">
            <path class="Hero-grower" d="M16 84.3c-.3 1-.5 2.2-.5 3.5 0 4.8 4 8.7 8.7 8.7h.8V79h-.8c-2.2 0-4.2.8-5.7 2-.2-1-1.3-2.5-4-1.8-4 .8-4.8 6.2-4.8 6.2v.7c.6 0 1.7-1 4.7-1H16zm9 15.8h-9.2c-5.7 0-8.3 7-8.3 7L.2 131s-1.2 4 2.4 5c3.6 1 4.7-3 4.7-3l6-20s.2-1.4 1.3-1c1.2.3.7 2 .7 2l-10 37h9.3v26.4c0 2.6 2 4.6 4.6 4.6 2.5 0 4.5-2 4.5-4.6V151H25v-51z"/>
          </g>
          <g class="Hero-person">
            <path class="Hero-grower" d="M128 68.2h-1c-6.5 0-11.6-5-11.6-11.5S120.4 45 127 45h1v23.2zm0 4.8h-12.2c-7.5 0-11 9-11 9l-9.5 31.6s-1.7 5.8 3 7.3c5 1 6.4-5 6.4-5l7.7-26.7s.4-2 2-1.6c1.4.4 1 2.6 1 2.6L101.8 140h12.5v36c0 3.3 2.7 6 6 6s6-2.7 6-6v-35.3h1.7V73z"/>
          </g>
          <g class="Hero-person">
            <path class="Hero-grower" d="M249.4 9.4c-.8 2-1.2 4-1.2 6 0 8.6 7 15.5 15.3 15.5h1.5V0h-1.5c-3.8 0-7.3 1.4-10 3.7-.2-2.2-2.2-4.5-7-3.4-7 1.5-8.4 11-8.4 11 0 1 0 1.5 1 1.2 1-1.3 3-3.3 8-3 1.7.3 2.7.2 3 0zm15.6 28h-16.2c-10 0-14.7 12-14.7 12L222 91s-2.3 7.7 4.2 9.6c6.3 2 8.2-5.6 8.2-5.6l10.3-35s.6-2.6 2.6-2c2 .6 1 3.4 1 3.4L230 127h17v47c0 4.4 3.5 8 8 8 4.4 0 8-3.6 8-8v-47h2.2V37.4z"/>
          </g>
          <g class="Hero-person">
            <path class="Hero-grower" d="M400 68.2h-1c-6.5 0-11.6-5-11.6-11.5S392.4 45 399 45h1v23.2zm0 4.8h-12.2c-7.5 0-11 9-11 9l-9.5 31.6s-1.7 5.8 3 7.3c5 1 6.4-5 6.4-5l7.7-26.7s.4-2 2-1.6c1.4.4 1 2.6 1 2.6L373.8 140h12.5v36c0 3.3 2.7 6 6 6s6-2.7 6-6v-35.3h1.7V73z"/>
          </g>
          <g class="Hero-person">
            <path class="Hero-grower" d="M502 96.5h-.8c-4.8 0-8.7-4-8.7-8.7 0-5 4-8.8 8.7-8.8h.8v17.5zm0 3.6h-9.2c-5.7 0-8.3 7-8.3 7l-7.3 24s-1.3 5 2.4 6c3.6 1 4.7-3 4.7-3l6-20s.2-1.2 1.3-1c1.2.5.7 2 .7 2l-10 37h9.3v26c0 2.7 2 4.7 4.6 4.7 2.5 0 4.5-2 4.5-4.5v-27h1.3v-51z"/>
          </g>
        </g>
      </svg>
    </div>
  `;
});
