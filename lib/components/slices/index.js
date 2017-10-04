const html = require('choo/html');
const asElement = require('prismic-element');
const { asText } = require('prismic-richtext');
const quicklink = require('./quicklink');
const twitter = require('../twitter');
const { href } = require('../../params');

module.exports = function slices(state, emit, items = null) {
  if (!items) { return element; }

  if (Array.isArray(items)) {
    let row = [];
    const rows = [];

    for (const slice of items) {
      switch (slice.slice_type) {
        case 'twitter': {
          row.push(element(slice));
          break;
        }
        default: {
          rows.push(close(row));
          row = [];
          rows.push(element(slice));
          break;
        }
      }
    }

    rows.push(close(row));

    return rows.filter(Boolean);
  }

  throw new Error('Unrecognized argument');

  function close(slices) {
    const length = slices.length;

    if (!length) { return null; }

    return html`
      <div class="Grid">
        ${ slices.reverse().map((slice, index) => {
          const pos = index + 1;
          let classNames = [ 'Grid-cell' ];

          if ((length - pos) > 2) {
            classNames.push('Grid-cell--sm1of2');
          }

          if ((length - pos) > 3) {
            classNames.push('Grid-cell--md1of3');
          }

          return html`
            <div class="${ classNames.join(' ') }">
              ${ element(slice) }
            </div>
          `;
        })}
      </div>
    `;
  }

  function element(slice) {
    switch (slice.slice_type) {
      case 'quicklink': return quicklink({
        title: asText(slice.primary.title),
        body: asElement(slice.primary.body, doc => href(state, doc))
      });
      case 'twitter': {
        const props = {
          emit,
          user: process.env.GLOBALGOALS_TWITTER_ID,
          hashtag: slice.primary.hashtag
        };

        let tweets;
        if (props.hashtag) {
          tweets = state.twitter.items[props.hashtag];
        } else {
          tweets = state.twitter.items[props.user];
        }

        return twitter(tweets, emit, props);
      }
      case 'section_header': return html`
        <div class="Space Space--contain Space--startTall">
          <div class="Text Text--growing">
            <h1 class="Text-h2">${ asText(slice.primary.title) }</h1>
            <p>${ asElement(slice.primary.introduction, doc => href(state, doc)) }</p>
          </div>
        </div>
      `;
      default: return slice;
    }
  }
};
