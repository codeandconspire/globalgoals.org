const html = require('choo/html');
const component = require('fun-component');
const { modulate, vh } = require('../base/utils');
const logo = require('../logo');
const nanoraf = require('nanoraf');

module.exports = component({
  name: 'manifest',
  beforerender(element) {

    /**
     * Circumvent mobile viewports calculating `vh` w/o address bar
     */

    element.style.height = `${ vh() }px`;
  },
  load(element) {
    element.classList.add('is-animating');

    const height = element.offsetHeight;
    const wheel = element.querySelector('.js-wheel');

    const onscroll = nanoraf(() => {
      const scrollY = window.scrollY;
      const y = modulate(scrollY, [0, height], [0, (height * -1)], true);
      const z = modulate(scrollY, [0, height], [1, 0.6], true);
      wheel.style.transform = `translateY(${ y }px) scale(${ z })`;
    });

    onscroll();
    window.addEventListener('scroll', onscroll, { passive: true });
    this.unload = function() {
      window.removeEventListener('scroll', onscroll);
    };
  },
  render() {
    return html`
      <article class="Manifest">
        <div class="Manifest-content">
          <div class="Manifest-paper">
            <p class="Manifest-text">
              <div class="Manifest-line">Imagine a world…</div>
              <div class="Manifest-line">Where there is <span class="u-color1">no poverty</span></div>
              <div class="Manifest-line">and <span class="u-color2">zero hunger</span>.</div>
              <div class="Manifest-line">We have <span class="u-color3">good health & well-being</span>,</div>
              <div class="Manifest-line"><span class="u-color4">quality education</span>,</div>
              <div class="Manifest-line">and full <span class="u-color5">gender equality</span> everywhere.</div>
              <div class="Manifest-line">There is <span class="u-color6">clean water & sanitation</span> for everyone.</div>
              <div class="Manifest-line"><span class="u-color7">Affordable & clean energy</span> has helped to create</div>
              <div class="Manifest-line"><span class="u-color8">decent work & economic growth</span>.</div>
              <div class="Manifest-line">Our prosperity is fueled by investments in <span class="u-color9">industry, innovation & infrastructure</span></div>
              <div class="Manifest-line">and that has helped us to <span class="u-color10">reduce inequalities</span>.</div>
              <div class="Manifest-line">We live in <span class="u-color11">sustainable cities & communities</span></div>
              <div class="Manifest-line">and <span class="u-color12">responsible consumption & production</span> is healing our world.</div>
              <div class="Manifest-line"><span class="u-color13">Climate action</span> has capped the warming of the planet</div>
              <div class="Manifest-line">and we have flourishing <span class="u-color14">life below water</span></div>
              <div class="Manifest-line">and abundant, diverse <span class="u-color15">life on land</span>.</div>
              <div class="Manifest-line">We enjoy <span class="u-color16">peace & justice through strong institutions</span></div>
              <div class="Manifest-line">and have built long term <span class="u-color17">partnerships for The Goals</span>.</div>
            </p>
          </div>
          <div class="Text Text--growing">
            <p>The Global Goals are only going to work if we fight for them and you can't fight for your rights if you don’t know what they are.</p>
          </div>
          <p class="Manifest-footer">
            <a class="Button" href="#goals">Explore the Goals</a>
          </p>
        </div>

        <div class="Manifest-tire">
          <div class="Manifest-wheel js-wheel">
            <div class="Manifest-rim">
              ${ logo.symbol() }
            </div>
          </div>
        </div>
      </article>
    `;
  }
});
