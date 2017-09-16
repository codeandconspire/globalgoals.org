const html = require('choo/html');
const asElement = require('prismic-element');
const { asText } = require('prismic-richtext');
const component = require('fun-component');
const nanoraf = require('nanoraf');
const modulate = require('../header/modulate');
const { label } = require('../icon');
const { __ } = require('../../locale');
const { href } = require('../../params');

const BACKGROUNDS = [
  require('./backgrounds/1'),
  require('./backgrounds/2'),
  require('./backgrounds/3'),
  require('./backgrounds/4'),
  require('./backgrounds/5'),
  require('./backgrounds/6'),
  require('./backgrounds/7'),
  require('./backgrounds/8'),
  require('./backgrounds/9'),
  require('./backgrounds/10'),
  require('./backgrounds/11'),
  require('./backgrounds/12'),
  require('./backgrounds/13'),
  require('./backgrounds/14'),
  require('./backgrounds/15'),
  require('./backgrounds/16'),
  require('./backgrounds/17')
];

const PARALLAX_AMOUNT = 80;

module.exports = function createHero(name) {
  return component({
    name: `hero:${ name || 'goal' }`,
    load(element) {
      if (name) {
        return;
      }

      this.element = element;
      this.height = this.getHeight();
      this.container = element.querySelector('.js-container');

      const onScroll = nanoraf(this.setTitlePosition.bind(this));

      window.addEventListener('scroll', onScroll, { passive: true });

      onScroll();

      this.unload = function() {
        window.removeEventListener('scroll', onScroll);
      };
    },
    render(state, goal, withBackground = true) {
      console.log(state)
      const doc = state.goals.items.find(item => item.data.number === goal);
      const classNames = [ 'Hero', `Hero--${ goal }` ];
      const inTransition = state.transitions.includes('takeover');
      const background = withBackground && BACKGROUNDS[goal - 1];

      if (inTransition) {
        classNames.push('Hero--takeover');
      } else {
        classNames.push(`u-bg${ goal }`);
      }

      return html`
        <section class="${ classNames.join(' ') }" id="hero">
          <div class="Hero-container js-container" id="hero-content">
            <div class="Hero-title js-title u-transformTarget">
              <h1 class="u-hiddenVisually">${ asText(doc.data.title) }</h1>
              ${ label(goal, 'Hero') }
            </div>

            ${ doc ? html`
              <div class="Hero-intro">
                <div class="u-transformTarget">
                  <div class="Text Text--adaptive Text--growing">
                    ${ asElement(doc.data.introduction, doc => href(state, doc)) }
                  </div>
                  <div class="Hero-link">
                    <div class="Text Text--adaptive">
                      <a href="#targets">
                        ${ __('Explore the Targets') }
                        <svg class="Text-icon" width="20" height="20" viewBox="0 0 20 20">
                          <g transform="rotate(90 10 10)" fill="none" fill-rule="evenodd">
                            <path d="M11.52 10L8 13.52l.73.73L12.98 10 8.73 5.75 8 6.48 11.52 10z" fill="currentColor" />
                            <circle stroke="currentColor" cx="10" cy="10" r="9.5" />
                          </g>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ` : null }

            </div>
          ${ background ? background() : null }
        </section>
      `;
    },
    setTitlePosition() {
      const scrollY = window.scrollY;
      const val = modulate(scrollY, [0, this.height], [0, PARALLAX_AMOUNT], true);

      this.container.style.transform = `translateY(${ val }px)`;
    },
    getHeight() {
      return this.element.getBoundingClientRect().height;
    }
  });
};
