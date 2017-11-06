const html = require('choo/html')
const component = require('fun-component')

module.exports = component(function background5 () {
  return html`
    <div class="Hero-bg Hero5" id="hero-bg-5">
      <svg class="u-hiddenVisually">
        <defs>
          <g id="hero5-patriarch" viewBox="0 0 29 137">
            <path id="group-3-a" d="M.73.5c6.1.12 11.03 5.04 11.03 11.1 0 6.07-4.92 11-11.03 11.12V.5zm0 80.52c1.36.16 1.52 1.37 1.54 1.86v47.18c0 3.52 2.9 6.4 6.5 6.4 3.58 0 6.47-2.88 6.47-6.4V48.18c.05-.87.32-2.24 1.63-2.24 1.9 0 2.2 1.38 2.2 2.4v27.32c0 2.45 2.02 4.45 4.52 4.45 2.47 0 4.5-2 4.5-4.43v-31.8c0-8-6.2-14.55-14.1-15.25-.28-.03-.55-.07-.88-.07H.72v52.47z"/>
          </g>
          <g id="hero5-woman" viewBox="0 0 61 137">
            <path fill="#fff" d="M33,23.2399445 C32.6368849,23.274917 32.2687922,23.2928041 31.8965097,23.2928041 C25.5448931,23.2928041 20.3997778,18.0861252 20.3997778,11.6530432 C20.3997778,5.22438867 25.5448931,0 31.8965097,0 C32.2687922,0 32.6368849,0.0179478466 33,0.0530340625 L33,23.2399445 Z M33,28.0405041 L20.8251074,28.0405041 C13.2669898,28.0405041 9.84419847,37.1477647 9.84419847,37.1477647 L0.288359713,68.64463 C0.288359713,68.64463 -1.40773609,74.4180222 3.42701123,75.8613702 C8.23990166,77.3047183 9.6999429,71.668577 9.6999429,71.668577 L17.4023161,45.3783906 C17.4023161,45.3783906 17.8219687,43.3550469 19.3213524,43.7933642 C20.8251074,44.2316816 20.2611993,46.3922762 20.2611993,46.3922762 L6.84980252,95.6564904 L19.3213524,95.6564904 L19.3213524,130.947679 C19.3213524,134.281547 22.0053803,137 25.3145156,137 C28.6192796,137 31.2945648,134.281547 31.2945648,130.947679 L31.2945648,95.6564904 L33,95.6564904 L33,28.0405041 Z"/>
          </g>
        </defs>
      </svg>

      <div class="Hero5-people">
        <svg class="Hero5-person" viewBox="0 0 61 137">
          <use class="Hero5-figure" x="32.2" xlink:href="#hero5-patriarch" />
          <g class="Hero5-grower">
            <use xlink:href="#hero5-woman" />
          </g>
        </svg>
        <svg class="Hero5-person" viewBox="0 0 61 137">
          <use class="Hero5-figure" x="32.2" xlink:href="#hero5-patriarch" />
          <g class="Hero5-grower"><use xlink:href="#hero5-woman" /></g>
        </svg>
        <svg class="Hero5-person" viewBox="0 0 61 137">
          <use class="Hero5-figure" x="32.2" y="0.5" xlink:href="#hero5-patriarch" />
          <g class="Hero5-grower">
            <use xlink:href="#hero5-woman" y="0.5" />
          </g>
        </svg>
        <svg class="Hero5-person" viewBox="0 0 61 137">
          <use class="Hero5-figure" x="32.2" xlink:href="#hero5-patriarch" />
          <g class="Hero5-grower"><use xlink:href="#hero5-woman" /></g>
        </svg>
        <svg class="Hero5-person" viewBox="0 0 61 137">
          <use class="Hero5-figure" x="32.2" xlink:href="#hero5-patriarch" />
          <g class="Hero5-grower"><use xlink:href="#hero5-woman" /></g>
        </svg>
      </div>
    </div>
  `
})
