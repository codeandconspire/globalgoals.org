const html = require('choo/html');
const raw = require('choo/html/raw');
const asElement = require('prismic-element');
const { asText } = require('prismic-richtext');
const twitter = require('../twitter');
const instagram = require('../instagram');
const card = require('../card');
const quicklink = require('./quicklink');
const { className } = require('../base/utils');
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
        case 'instagram': {
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

    let row = [];
    const rows = [];

    for (const slice of slices.slice().reverse()) {
      if (row.length === 3) {
        rows.push(row.reverse());
        row = [];
      }
      row.push(slice);
    }

    rows.push(row.reverse());

    return html`
      <div class="Grid">
        ${ rows.reverse().reduce((cells, row) => cells.concat(row.map((slice, index) => {
          const classes = className('Grid-cell', {
            'Grid-cell--md1of2': row.length === 2 || row.length === 3 && index > 0,
            'Grid-cell--lg1of3': row.length === 3
          });

          return html`
            <div class="${ classes }">
              ${ element(slice, row.length) }
            </div>
          `;
        })), []) }
      </div>
    `;
  }

  function element(slice, cols) {
    switch (slice.slice_type) {
      case 'quicklink': return quicklink({
        title: asText(slice.primary.title),
        body: asElement(slice.primary.body, doc => href(state, doc))
      });
      case 'embed': {
        const embed = slice.primary.content.find(block => {
          return block.type === 'embed';
        });

        const element = html`
          <div class="Text Text--full" id="video">
            <div class="Text-embed">
              ${ typeof window === 'undefined' ? raw(embed.oembed.html) : null }
            </div>
          </div>
        `;

        if (typeof window !== 'undefined') {
          element.firstElementChild.innerHTML = embed.oembed.html;
        }

        return element;
      }
      case 'twitter': {
        const props = {
          emit,
          user: process.env.TWITTER_USERNAME,
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
      case 'instagram': {
        const props = {
          emit,
          user: process.env.INSTAGRAM_USERNAME,
          hashtag: slice.primary.hashtag
        };

        let photos;
        if (props.hashtag) {
          photos = state.instagram.items[props.hashtag];
        } else {
          photos = state.instagram.items[props.user];
        }

        return instagram(photos, cols, emit, props);
      }
      case 'link': {
        const options = {};

        if (cols === 1) {
          options.horizontal = true;
        }

        if (cols <= 2) {
          options.largeText = true;
        }

        if (slice.primary.color) {
          options.fill = slice.primary.color;
        }

        switch (slice.primary.link.link_type) {
          case 'Document': {
            switch (slice.primary.link.type) {
              case 'activity': {
                const doc = state.activities.items.find(item => {
                  return item.id === slice.primary.link.id;
                });

                if (!doc) {
                  emit('activities:fetch', slice.primary.link.uid);
                  return card.loading();
                }

                options.fill = true;

                return card(state, emit, activity(doc), options);
              }
              case 'news': {
                const doc = state.articles.items.find(item => {
                  return item.id === slice.primary.link.id;
                });

                if (!doc) {
                  emit('articles:fetch', slice.primary.link.uid);
                  return card.loading();
                }

                return card(state, emit, news(doc), options);
              }
              default: return null;
            }
          }
          case 'Web': return card(state, emit, {
            title: slice.primary.title,
            image: slice.primary.image,
            body: slice.primary.body,
            href: slice.primary.link.url,
            link: slice.primary.link_text
          }, options);
          default: return null;
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
