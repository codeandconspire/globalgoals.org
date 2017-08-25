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

  return html`
    <article onclick=${ props.href ? onclick : null } class="Card ${ Object.keys(opts).map(key => opts[key] ? `Card--${ key }` : '').join(' ') }">
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

        <div class="Text ${ opts.fill ? 'Text--adaptive' : '' }">
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
            ${ props.link }
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
  return html`
    <div class="Card">
      <div class="Card-figure"></div>
      ${ opts.date ? html`
        <span class="Card-meta"><span class="u-loading">${ __('LOADING_TEXT_SHORT') }</span></span>
      ` : null }
      <div class="Text">
        <h1 class="Text-h4"><span class="u-loading">${ __('LOADING_TEXT_MEDIUM') }</span></h1>
        <p><span class="u-loading">${ __('LOADING_TEXT_LONG') }</span></p>
      </div>
      <span class="Card-link u-removePseudo"><span class="u-loading">${ __('LOADING_TEXT_MEDIUM') }</span></span>
    </div>
  `;
}

function asSnippet(richText) {
  const preamble = richText.find(node => node.type === 'paragraph');

  return preamble ? html`
    <p>
      ${ preamble.text.substr(0, 140).replace(TRAILING_WORD, '…') }
    </p>
  ` : null;
}
