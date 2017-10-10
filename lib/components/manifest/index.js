const html = require('choo/html');
const component = require('fun-component');
const { modulate, vh } = require('../base/utils');
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
    const height = element.offsetHeight;
    const figure = element.querySelector('.js-figure');

    const onscroll = nanoraf(() => {
      const scrollY = window.scrollY;
      const y = modulate(scrollY, [0, height], [0, (height * -1)], true);
      const z = modulate(scrollY, [0, height], [1, 0.6], true);
      figure.style.transform = `translateY(${ y }px) scale(${ z })`;
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

        <div class="Manifest-figure js-figure">
          <svg class="Manifest-circle" viewBox="0 0 302 302" role="presentation" aria-hidden="true">
            <g fill="none" fill-rule="evenodd">
              <path fill="#5BB249" d="M77.968,107.955 C81.718,101.584 86.266,95.744 91.479,90.574 L47.175,41.993 C36.028,52.645 26.523,64.994 19.047,78.605 L77.968,107.955"/>
              <path fill="#D8AE48" d="M186.577,73.635 C193.285,76.709 199.524,80.631 205.155,85.275 L249.585,36.768 C237.883,26.677 224.614,18.351 210.21,12.202 L186.577,73.635"/>
              <path fill="#B32939" d="M288.325,88.242 L229.439,117.596 C232.252,124.16 234.251,131.131 235.335,138.402 L300.839,132.219 C298.907,116.711 294.614,101.924 288.325,88.242"/>
              <path fill="#4A9C47" d="M225.214,109.086 L284.093,79.736 C276.799,66.184 267.497,53.872 256.579,43.206 L212.149,91.701 C217.21,96.9 221.61,102.738 225.214,109.086"/>
              <path fill="#3F794A" d="M66.267,150.931 C66.267,149.607 66.311,148.283 66.368,146.967 L0.849,141.101 C0.644,144.349 0.518,147.627 0.518,150.931 C0.518,163.498 2.079,175.707 4.98,187.375 L68.259,169.222 C66.962,163.326 66.267,157.213 66.267,150.931"/>
              <path fill="#F4BB39" d="M216.968,204.783 C212.311,210.451 206.936,215.504 200.989,219.814 L235.583,275.824 C248.422,267.125 259.852,256.5 269.46,244.365 L216.968,204.783"/>
              <path fill="#DE4A3B" d="M236.25,150.931 C236.25,157.135 235.583,163.183 234.303,169.01 L297.574,187.189 C300.459,175.572 301.997,163.426 301.997,150.931 C301.997,147.828 301.894,144.748 301.704,141.68 L236.191,147.867 C236.227,148.892 236.25,149.908 236.25,150.931"/>
              <path fill="#ED9643" d="M86.61,206.035 L34.242,245.836 C43.982,257.828 55.517,268.281 68.441,276.816 L103.028,220.867 C96.935,216.654 91.414,211.66 86.61,206.035"/>
              <path fill="#238CC0" d="M67.328,137.514 C68.5,130.113 70.645,123.035 73.603,116.406 L14.741,87.08 C8.237,100.922 3.778,115.904 1.75,131.633 L67.328,137.514"/>
              <path fill="#8B2242" d="M227.536,280.89 L192.993,224.955 C186.717,228.498 179.957,231.279 172.833,233.146 L185.024,297.851 C200.191,294.367 214.493,288.582 227.536,280.89"/>
              <path fill="#2BB8CF" d="M231.782,178.172 C229.491,184.9 226.393,191.25 222.586,197.109 L275.12,236.734 C283.653,224.467 290.397,210.883 295.003,196.34 L231.782,178.172"/>
              <path fill="#E46A3E" d="M163.517,235.035 C159.518,235.613 155.425,235.928 151.258,235.928 C147.912,235.928 144.608,235.719 141.365,235.342 L129.18,300.049 C136.392,301.107 143.759,301.668 151.258,301.668 C159.577,301.668 167.742,300.984 175.695,299.683 L163.517,235.035"/>
              <path fill="#DB3244" d="M156.692,66.107 C163.993,66.576 171.044,67.965 177.725,70.168 L201.355,8.753 C187.296,3.788 172.298,0.849 156.692,0.3 L156.692,66.107"/>
              <path fill="#CE2865" d="M131.998,233.724 C124.631,232.006 117.63,229.33 111.135,225.834 L76.526,281.81 C89.84,289.431 104.397,295.074 119.826,298.361 L131.998,233.724"/>
              <path fill="#1E445B" d="M125.716,69.865 C132.54,67.707 139.739,66.393 147.187,66.045 L147.187,0.247 C131.369,0.669 116.173,3.55 101.923,8.493 L125.716,69.865"/>
              <path fill="#B88F3F" d="M80.847,198.474 C76.673,192.308 73.267,185.556 70.82,178.377 L7.586,196.523 C12.375,211.605 19.472,225.658 28.472,238.275 L80.847,198.474"/>
              <path fill="#1D648D" d="M98.599,84.266 C104.155,79.865 110.27,76.156 116.825,73.236 L93.046,11.895 C78.884,17.841 65.834,25.893 54.264,35.647 L98.599,84.266"/>
            </g>
          </svg>
        </div>
      </article>
    `;
  }
});
