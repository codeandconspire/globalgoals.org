const html = require('choo/html');
const asElement = require('prismic-element');
const { asText } = require('prismic-richtext');
const twitter = require('../twitter');
const card = require('../card');
const quicklink = require('./quicklink');
const { href } = require('../../params');
const { __ } = require('../../locale');

module.exports = function slices(state, emit, items = null) {
  if (!items) { return props => element(props, 1); }

  if (Array.isArray(items)) {
    let row = [];
    const rows = [];

    for (const slice of items) {
      switch (slice.slice_type) {
        case 'link':
        case 'twitter': {
          row.push(slice);
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
          let cols = 1;
          let classNames = [ 'Grid-cell' ];

          if ((length - pos) >= 2) {
            cols = 2;
            classNames.push('Grid-cell--sm1of2');
          }

          if ((length - pos) >= 3) {
            cols = 3;
            classNames.push('Grid-cell--md1of3');
          }

          return html`
            <div class="${ classNames.join(' ') }">
              ${ element(slice, cols) }
            </div>
          `;
        }).reverse() }
      </div>
    `;
  }

  function element(slice, cols) {
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

        return twitter(tweets, cols, emit, props);
      }
      case 'link': {
        const options = {};

        if (cols === 1) {
          options.horizontal = true;
          options.fill = true;
          options.largeText = true;
        }

        switch (slice.primary.link.type) {
          case 'activity': return card(state, emit, activity(slice.primary.link), options);
          case 'news': return card(state, emit, news(slice.primary.link), options);
          default: return card(state, emit, other(slice.primary.link), options);
        }
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

  function other(doc) {
    return {
      title: doc.data.title,
      image: doc.data.image,
      body: doc.data.introduction || doc.data.body,
      tags: doc.tags,
      href: href(state, doc),
      link: asText(doc.data.link_text)
    };
  }

  function news(doc) {
    return {
      title: doc.data.title,
      image: doc.data.image,
      body: doc.data.introduction || doc.data.body,
      tags: doc.tags,
      date: doc.data.original_publication_date || doc.first_publication_date,
      href: href(state, doc),
      link: __('Read the full article')
    };
  }

  function activity(doc) {
    return {
      title: doc.data.title,
      image: doc.data.image,
      body: doc.data.introduction || doc.data.body,
      tags: doc.tags,
      href: href(state, doc),
      link: __('View campaign')
    };
  }
};
