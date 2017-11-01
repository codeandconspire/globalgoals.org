const html = require('choo/html');
var { asText } = require('prismic-richtext');
const tags = require('../tags');
const { __ } = require('../../locale');
const { color } = require('../base');
const { requestsNewTarget, image, luma, className, externalURL } = require('../base/utils');

const TAG_REGEX = /^goal-(\d{1,2})$/;
const ORIGIN_REGEX = /^[\w-]+:\/{2,}\[?[\w\.:-]+\]?(?::[0-9]*)?/;
const TRAILING_WORD = /\s\w+$/;
const SIZES = ['small', 'medium', 'large'];

module.exports = card;
card.loading = loading;

function card(state, emit, props, opts = {}) {
  const date = props.date && new Date(props.date);
  const img = props.image.url ? image(props.image, props.sizes || SIZES) : null;
  const textClassList = getTextClassList(opts);
  let cardClassList = getCardClassList(opts);

  let goalTags = [];
  if (props.tags) {
    goalTags = props.tags
      .map(tag => tag.match(TAG_REGEX))
      .filter(Boolean)
      .map(match => match[1]);
  }

  let style = '';
  if (opts.fill) {
    let bgColor;

    if (typeof opts.fill === 'string') {
      bgColor = opts.fill;
    } else if (goalTags.length) {
      bgColor = color(goalTags[0]);
    }

    if (bgColor) {
      style = `background-color:${ bgColor };`;

      if (luma(bgColor) > 185) {
        cardClassList += ' Card--light';
      }
    }
  }

  if (props.href || props.file) {
    cardClassList += ' Card--linked';
  }

  const external = externalURL(props.href);

  return html`
    <article onclick=${ props.href || props.file ? onclick : null } class="${ cardClassList }">
      <figure class="Card-figure">
        ${ img ? html`
          <img class="Card-image" src="${ img.src }" alt="${ img.alt }" width="${ img.width }" height="${ img.height }" srcset="${ img.srcset }" sizes="${ img.sizes }" />
        ` : null }
      </figure>

      <div class="Card-content" style="${ style }">
        ${ date ? html`
          <time class="Card-meta" datetime="${ JSON.stringify(date) }">
            ${ __('Published on %s %s, %s', __(`MONTH_${ date.getMonth() }`), date.getDate(), date.getFullYear()) }
          </time>
        ` : null }

        <div class="Card-body">
          <div class="${ textClassList }">
            <h1 class="Text-h4">${ asText(props.title) }</h1>
            ${ asSnippet(props.body) }
          </div>
        </div>

        ${ goalTags.length ? html`
          <div>
            <span class="u-hiddenVisually">${ __('Related goals') }:</span>
            <div class="${ className('Card-tags', { 'Card-tags--single': goalTags.length === 1 }) }">
              ${ tags(goalTags) }
            </div>
          </div>
        ` : null }

        ${ props.href ? html`
          <a class="Card-link" href="${ props.href }" target=${ external ? '_blank' : null } rel=${ external ? 'noopener noreferrer' : null }>
            <span class="Card-linkText">
              ${ props.link }
              ${ external ? html`
                <svg class="Card-external" viewBox="0 0 16 16">
                  <g fill="currentColor" fill-rule="evenodd">
                    <path d="M0 0h1v16H0zm15 11h1v5h-1z"/>
                    <path d="M5 0v1H0V0m16 15v1H0v-1M15-1z"/>
                    <g class="Card-externalArrow">
                      <path d="M15 0h1v7h-1z"/>
                      <path d="M16 0v1H9V0"/>
                      <path d="M15 .2l.8.7-7.5 7.3-.7-.7"/>
                    </g>
                  </g>
                </svg>
              ` : html`
                <div class="Card-arrow"></div>
              ` }
            </span>
          </a>
        ` : null }

        ${ props.file ? html`
          <a class="Card-link" download href="${ props.file }">
            <span class="Card-linkText">
              ${ props.link }
              <svg viewBox="0 0 13 16" class="Card-download">
                <g fill="currentColor" fill-rule="evenodd">
                  <path d="M1 15h11v1H1z"/>
                  <path class="Card-downloadArrow" d="M6 10L1 5l-.8.7L6.5 12l6.2-6.3L12 5l-5 5V0H6v10z"/>
                </g>
              </svg>
            </span>
          </a>
        ` : null }
      </div>
    </article>
  `;

  function onclick(e) {
    if (requestsNewTarget(e) || external) {
      window.open(props.href, '_blank');
      e.preventDefault();
      return;
    }

    if (props.file) {
      let link = document.createElement('a');
      link.setAttribute('download', true);
      link.href = props.file;
      link.click();
      link = null;
      event.preventDefault();
      return;
    }

    const url = ORIGIN_REGEX.test(props.href) && new URL(props.href);
    if (url && (url.origin !== window.location.origin)) {
      window.location.assign(props.href);
      return;
    }

    emit(state.events.PUSHSTATE, props.href);
    e.preventDefault();
  }
}

function loading(opts = {}) {
  const loadingClass = opts.fill ? 'u-loadingOnGray' : 'u-loading';
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
  let classList = Object.keys(opts).reduce((classNames, key) => {
    return opts[key] ? classNames.concat(`Card--${ key }`) : classNames;
  }, [ 'Card' ]).join(' ');

  classList += loading ? ' is-loading' : '';

  return classList;
}

function getTextClassList(opts) {
  return className('Text', {
    'Text--growing Text--growingTitles': opts.largeText,
    'Text--adaptive': opts.fill
  });
}

function asSnippet(richText) {
  const preamble = richText.find(node => node.type === 'paragraph');

  return preamble ? html`
    <p>
      ${ preamble.text.substr(0, 170).replace(TRAILING_WORD, '…') }
    </p>
  ` : null;
}
