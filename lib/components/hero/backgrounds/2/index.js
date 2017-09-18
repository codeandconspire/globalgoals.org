const html = require('choo/html');
const component = require('fun-component');
const { vw } = require('../../../base/utils');

module.exports = component({
  name: 'background-2',
  load(element) {
    const field = element.querySelector('.js-field');
    const crops = element.querySelectorAll('.js-crop');

    if (vw() < 900) {
      const [ x, y, width, height ] = field.getAttribute('viewBox').split(' ');
      field.setAttribute('viewBox', [ x, y, width * 0.7, height ].join(' '));

      for (let i = 0; i < crops.length; i += 1) {
        const crop = crops[i];
        const current = +crop.getAttribute('x');
        const next = (current * 0.7);

        crop.setAttribute('x', next);
      }
    }
  },
  render() {
    return html`
      <div class="Hero2" id="hero-bg-2">
        <svg class="Hero2-field js-field" viewBox="0 0 1440 246">
          <symbol id="hero-wheat" viewBox="0 0 40 160">
            <path fill="currentColor" fill-rule="evenodd" d="M19.6 27s-7.3 7.8-7.3 13.5c0 4.8 5.6 7.8 7.2 9 0 0 7.5-4 7.5-9 0-6-7.4-13.6-7.4-13.6M3.2 41S2 54 7.6 58c0 0 1.8 2.4 10.5 3.8 0 0 1-8.4-2-12 0 0-1.6-2.4-12.6-8.7M2 57S.8 71.3 6.8 75.6c0 0 2 2.6 11.4 4 0 0 1-9-2.3-12.8 0 0-2-2.8-13.8-9.6m0 18.3s-2 15.2 4 19.5c0 0 2.4 3 11.8 4.4 0 0 1.6-9.4-2-13 0 0-2-4-13.6-11M.4 94s-1 15.8 5 20c0 0 3 3 12.5 4.6 0 0 1-10.3-2.6-14 0 0-3-4.2-15.3-10.6m36-53s1.2 13-4.4 17c0 0-2 2.4-10.6 3.8 0 0-1-8.4 2.3-12 0 0 1.6-2.4 12.6-8.7m1 16s1.3 14.3-4.7 18.6c0 0-2 2.6-11.4 4 0 0-1-9 2.4-12.8 0 0 1.7-2.8 13.6-9.6m0 18.5s2 15.2-4.2 19.5c0 0-2.4 3-11.8 4.4 0 0-1.4-9.4 2-13 0 0 2-4 14-11M38.8 94s1 15.8-5 20c0 0-3.2 3-12.6 4.6 0 0-1-10.3 2.3-14 0 0 3-4.2 15.3-10.6m-21.4 65.3h4.2V121h-4.2M6.4 13c0-1-.8-1.5-1.5-1.5-1 0-1.7.6-1.7 1.4v25.3l3 1.6V13zM12 8.4c0-.7-.7-1.3-1.5-1.3-.7 0-1.3 1-1.3 1.6V39c.5-1.5 1.6-4.7 2.7-6.7v-24zm5.8-7C17.8.6 17 0 16.4 0c-.8 0-1.4.6-1.4 1.4V28l2.8-3.8V1.4zM33 13c0-1 .5-1.5 1.3-1.5s1.4.6 1.4 1.4v25.3L33 40V13zm-5.7-4.6c0-.7.6-1.3 1.3-1.3.8 0 1.4 1 1.4 1.6V39c-.5-1.5-1.6-4.7-2.7-6.7v-24zm-6-7c0-.8.8-1.4 1.5-1.4.8 0 1.4.6 1.4 1.4V28l-2.8-4V1.4z"/>
          </symbol>
          <symbol id="hero-corn" viewBox="0 0 57 160">
            <path fill="currentColor" d="M33.8 98.43l8.16-24.56c.3-.87 1.4-1.12 2.04-.46l10.35 10.9-9.3-4c-1-.4-2.2 0-2.68 1L33.8 98.5zm-5.2-18.4l-11.35-34.2c-.4-1.22-1.95-1.57-2.84-.64L0 60.3l12.93-5.6c1.42-.6 3.07 0 3.75 1.37L28.6 80.03zm-3.9-64.9c0 9.34 3.08 16.9 6.88 16.9s6.88-7.56 6.88-16.9c0-5.77-2.6-10.85-4.62-13.9-1.06-1.64-3.46-1.64-4.53 0-2 3.05-4.6 8.13-4.6 13.9"/>
            <path fill="currentColor" d="M31.85 24.9c.1 0 .32-.04.48-.24l4.77-6.04c-.82-7.74-5.53-13.7-5.53-13.7s-4.63 5.86-5.5 13.5l5.3 6.26c.16.18.35.2.48.2"/>
            <path fill="currentColor" d="M31.94 39.18c-.4 0-.64-.03-.64-.03h-.02c-7.74 0-8.97-9.4-9.63-14.43l-.2-1.5c-.1-.5-.53-.88-1.05-.88l-10.02.6 9.9-6c.36-.22.8-.34 1.22-.34.7 0 1.36.3 1.8.83l6.98 8.2c.4.45.96.7 1.57.7.63 0 1.23-.28 1.62-.77l6.4-8.13c.5-.6 1.2-.96 2-.96.65 0 1.27.26 1.74.72l9.1 8.7-9.4-3.6c-.1 0-.2 0-.2.2-.6 15.4-8.6 16.6-11 16.6"/>
            <path fill="#DDA63A" d="M41.86 15.5c-1.08 0-2.07.48-2.74 1.32l-3.45 4.38-2.97 3.75c-.28.36-.65.42-.85.42-.2 0-.55-.05-.83-.4l-3.6-4.22-3.37-3.95c-.64-.75-1.57-1.18-2.55-1.18-.6 0-1.2.17-1.73.48l-6.52 3.95-6.75 4.08 7.87-.46 6.02-.36v.1l.2 1.5c.6 5 2 15.3 10.6 15.3h.6c1.1 0 4.2-.3 6.9-2.8 2.9-2.8 4.6-7.3 5-13.6l4 1.6 8.8 3.37L49.9 22l-5.66-5.5c-.67-.66-1.54-1-2.45-1m0 1.94c.4 0 .7.14 1 .43l5.6 5.5-5-1.88c-.2-.1-.3-.1-.48-.1-.63 0-1.18.5-1.2 1.1-.53 14.6-8 15.6-10.05 15.6-.34 0-.54-.1-.54-.1-7.8 0-8.34-10.75-9-15.1-.17-1-1-1.7-2-1.7H20l-6.04.33 6.5-3.94c.2-.14.5-.2.7-.2.4 0 .8.16 1.06.5l3.46 4 3.6 4.24c.6.7 1.5 1.1 2.34 1.1.9 0 1.8-.4 2.4-1.17L37 22.33l3.4-4.3c.3-.4.76-.6 1.2-.6"/>
            <path stroke="currentColor" stroke-width="3.9" d="M31.48 40.13v119.44"/>
            <path fill="currentColor" d="M28 127.78l-8.14-24.56c-.3-.87-1.4-1.12-2.04-.46L7.47 113.6l9.28-4c1.02-.45 2.2-.02 2.7.98l8.56 17.2z"/>
          </symbol>
          <symbol id="hero-barley" viewBox="0 0 43 160">
            <path stroke="currentColor" stroke-width="3.9" d="M32.7 47c1.4 5.4 1.7 17.8 1.7 24v88.6"/>
            <path fill="currentColor" d="M17 42.6s5 4.6 8.3 3.6c0 0 1.5 0 4.8-3 0 0-3-3-5-2.8 0 0-1 0-7 2.2M43 35s-6.6-1-8.7 1.8c0 0-1.3 1-2 5.3 0 0 4 1 6-1 0 0 1.2 0 4.7-6m-5.7-10s-6.5 2-7.5 5c0 0-.8 2 0 6 0 0 4-1 5.3-3 0 0 1-1 3-7m-7-11s-6 3-6 7c0 0 0 1 2 5 0 0 4-2 4-4.2 0 0 .7-1.4 0-7.8m-8-8s-5 4.6-4.4 8c0 0-.2 1.5 2.4 5 0 0 3-2.6 3-5 0 0 0-1.5-1.6-7.7M15 1s-4.2 5-3 8.3c0 0 0 1.5 3 4.7 0 0 3-3.2 2.8-5.6 0 0 0-1.5-2.5-7.4m0 32.2s3.8 5.4 7.2 5c0 0 1.5.4 5.3-2 0 0-2.4-3.4-4.7-3.7 0 0-1-.5-7 .7m-3-6.8s5 4.7 8 3.8c0 0 2 0 5-2.8 0 0-3-3-5-3 0 0-1.4-.2-7.4 2m-6-6.2s5 4.6 8 3.6c0 0 1.8 0 5-3 0 0-3-3-5.4-3 0 0-1.7 0-7.7 2.4m-6-7.5s4.3 5 7.8 4.5c0 0 1.6.2 5-2.5 0 0-2.6-3.3-5-3.4 0 0-1.4-.3-7.6 1.4M.4 0s0 6.7 3.2 8.4c0 0 1 1 5.5 1.3 0 0 0-4.3-2-6 0 0-.4-1-6.3-3.6M35 158l7.3-101c4.8.3-6.8 101.6-6.8 101.6m-1 1.2L28 77c-4.8.4 5.2 82.6 5.2 82.6"/>
          </symbol>
          <symbol id="hero-carrot" viewBox="0 0 23 82">
            <path fill="currentColor" fill-rule="evenodd" d="M6.7 15.7C2 16.4-.7 20.4.2 25.2l.3 1.5H9c.6 0 1 .4 1 1 0 .5-.4 1-1 1H1l1.3 7H9c.6 0 1 .4 1 1 0 .4-.4 1-1 1H2.7l1.4 7h5c.8 0 1 .4 1 1 0 .4-.2 1-1 1H4.7L7.2 61c1 5.2 2.7 5.2 3.7 0l7-36c1-4.8-2-8.8-6.8-9.5V15l.8-3.6c.6-2 1.4-3.3 2.3-4 .4-.4.4-1 0-1.4-.2-.4-.8-.5-1.3 0-1 1-2 2.6-2.7 5l-.3 1.3V1c0-.5-.5-1-1-1S8 .5 8 1v9.3c0-.4 0-.8-.2-1C7.3 6.8 6.5 5 5.4 3.6c-.3-.4-1-.5-1.4 0-.4.2-.4.8 0 1.2.8 1 1.4 2.6 2 4.6.3 1.5.5 3 .6 4.6v1.5z"/>
          </symbol>
          <use x="-715" height="94" y="152" class="Hero2-crop Hero2-crop--barley Hero2-crop--dark Hero2-crop--sm js-crop" xlink:href="#hero-barley" />
          <use x="-660" height="246" y="1" class="Hero2-crop Hero2-crop--corn Hero2-crop--lg js-crop" xlink:href="#hero-corn" />
          <use x="-618" height="94" y="152" class="Hero2-crop Hero2-crop--corn Hero2-crop--dark Hero2-crop--sm js-crop" xlink:href="#hero-corn" />
          <use x="-528" height="62" y="184" class="Hero2-crop Hero2-crop--wheat Hero2-crop--dark Hero2-crop--xs js-crop" xlink:href="#hero-wheat" />
          <use x="-516" height="243" y="4" class="Hero2-crop Hero2-crop--barley Hero2-crop--lg js-crop" xlink:href="#hero-barley" />
          <use x="-417" height="62" y="184" class="Hero2-crop Hero2-crop--wheat Hero2-crop--dark Hero2-crop--xs js-crop" xlink:href="#hero-wheat" />
          <use x="-318" height="108" y="139" class="Hero2-crop Hero2-crop--wheat js-crop" xlink:href="#hero-wheat" />
          <use x="-278" height="62" y="184" class="Hero2-crop Hero2-crop--wheat Hero2-crop--dark Hero2-crop--xs js-crop" xlink:href="#hero-wheat" />

          <use x="144" y="210" height="86" class="Hero2-crop Hero2-crop--carrot Hero2-crop--sm js-crop" xlink:href="#hero-carrot" />
          <use x="184" y="201" height="102"class="Hero2-crop Hero2-crop--carrot js-crop" xlink:href="#hero-carrot" />
          <use x="218" y="210" height="86" class="Hero2-crop Hero2-crop--carrot Hero2-crop--sm js-crop" xlink:href="#hero-carrot" />

          <use x="355" y="137" height="115" class="Hero2-crop Hero2-crop--barley Hero2-crop--dark Hero2-crop--mirror js-crop" xlink:href="#hero-barley" />
          <use x="398" y="179" height="77" class="Hero2-crop Hero2-crop--wheat Hero2-crop--dark Hero2-crop--xs js-crop" xlink:href="#hero-wheat" />
          <use x="484" y="137" height="118" class="Hero2-crop Hero2-crop--corn Hero2-crop--dark js-crop" xlink:href="#hero-corn" />
          <use x="590" y="174" height="77" class="Hero2-crop Hero2-crop--wheat Hero2-crop--dark Hero2-crop--xs js-crop" xlink:href="#hero-wheat" />
          <use x="614" y="6" height="243" class="Hero2-crop Hero2-crop--barley Hero2-crop--lg js-crop" xlink:href="#hero-barley" />
          <use x="708" y="114" height="133" class="Hero2-crop Hero2-crop--wheat js-crop" xlink:href="#hero-wheat" />

          <g>
            <use x="-568" height="160" y="117" class="Hero2-crop Hero2-crop--grow Hero2-crop--wheat js-crop" xlink:href="#hero-wheat" />
            <use x="-451" height="94" y="182" class="Hero2-crop Hero2-crop--grow Hero2-crop--wheat Hero2-crop--dark Hero2-crop--sm js-crop" xlink:href="#hero-wheat" />
            <use x="-373" height="164" y="113" class="Hero2-crop Hero2-crop--grow Hero2-crop--corn js-crop" xlink:href="#hero-corn" />
            <use x="316" y="189" height="92" class="Hero2-crop Hero2-crop--grow Hero2-crop--wheat Hero2-crop--dark Hero2-crop--xs js-crop" xlink:href="#hero-wheat" />
            <use x="439" y="148" height="132" class="Hero2-crop Hero2-crop--grow Hero2-crop--wheat js-crop" xlink:href="#hero-wheat" />
            <use x="529" y="46" height="235" class="Hero2-crop Hero2-crop--grow Hero2-crop--corn Hero2-crop--lg js-crop" xlink:href="#hero-corn" />
          </g>
        </svg>
      </div>
    `;
  }
});
