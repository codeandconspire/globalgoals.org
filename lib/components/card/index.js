const html = require('choo/html');
var { asText } = require('prismic-richtext');
const { __ } = require('../../locale');

const GOAL_TAG = /^goal-(\d{1,2})$/;
const TRAILING_WORD = /\s\w+$/;

module.exports = card;
card.loading = loading;

function card(state, emit, props, opts = {}) {
  const date = props.date && new Date(props.date);
  const tags = props.tags ? props.tags.filter(tag => GOAL_TAG.test(tag)) : [];
  const cardClassList = getCardClassList(opts);
  const textClassList = getTextClassList(opts);

  return html`
    <article onclick=${ props.href ? onclick : null } class="${ cardClassList }">
      <figure class="Card-figure">
        <!-- TODO: Handle sizes -->
        ${ props.image.url ? html`
          <img src="${ props.image.url }" class="Card-image" alt="${ props.image.alt }" />
        ` : null }
        ${ props.image.copyright ? html`
          <figcaption class="Card-meta Card-meta--caption">
            ${ props.image.copyright }
          </figcaption>
        ` : null }
      </figure>

      <div class="Card-content">
        ${ date ? html`
          <time class="Card-meta" datetime="${ JSON.stringify(date) }">
            ${ __('Published on %s %s, %s', __(`MONTH_${ date.getMonth() }`), date.getDate(), date.getFullYear()) }
          </time>
        ` : null }

        <div class="${ textClassList }">
          <h1 class="Text-h4">${ asText(props.title) }</h1>
          ${ asSnippet(props.body) }
        </div>

        ${ tags.length ? html`
          <div>
            <span class="u-hiddenVisually">${ __('Related goals') }:</span>
            <div class="Card-tags">
              ${ tags.map(tag => tag.match(GOAL_TAG)[1]).map(number => html`
                <span class="Card-tag u-bg${ number }">${ number }</span>
              `) }
            </div>
          </div>
        ` : null }

        ${ props.href ? html`
          <a class="Card-link" href="${ props.href }">
            <span class="Card-linkText">${ props.link }</span>
          </a>
        ` : null }
      </div>
    </article>
  `;

  function onclick(e) {
    if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) { return; }
    emit(state.events.PUSHSTATE, props.href);
    e.preventDefault();
  }
}

function loading(opts = {}) {
  const loadingClass = opts.fill ? 'u-loadingAdaptive' : 'u-loading';
  const cardClassList = getCardClassList(opts, true);
  const textClassList = getTextClassList(opts);

  return html`
    <div class="${ cardClassList }">
      <div class="Card-figure"></div>
      <div class="Card-content">
        ${ opts.date ? html`
          <span class="Card-meta"><span class="${ loadingClass }">${ __('LOADING_TEXT_MEDIUM') }</span></span>
        ` : null }
        <div class="${ textClassList }">
          <h1 class="Text-h4"><span class="${ loadingClass }">${ __('LOADING_TEXT_MEDIUM') }</span></h1>
          <p><span class="${ loadingClass }">${ __('LOADING_TEXT_LONG') }</span></p>
        </div>
        <span class="Card-link"><span class="${ loadingClass }">${ __('LOADING_TEXT_MEDIUM') }</span></span>
      </div>
    </div>
  `;
}

function getCardClassList(opts, loading) {
  let classList = 'Card';
  classList += Object.keys(opts).map(key => opts[key] ? ` Card--${ key }` : '').join(' ')
  classList += loading ? ' is-loading' : '';
  return classList;
}

function getTextClassList(opts) {
  let classList = 'Text';
  classList += opts.largeText ? ' Text--growing Text--growingTitles' : '';
  classList += opts.fill ? ' Text--adaptive' : '';
  return classList;
}

function asSnippet(richText) {
  const preamble = richText.find(node => node.type === 'paragraph');

  return preamble ? html`
    <p>
      ${ preamble.text.substr(0, 140).replace(TRAILING_WORD, '…') }
    </p>
  ` : null;
}
