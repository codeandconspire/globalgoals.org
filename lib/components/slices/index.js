const html = require('choo/html')
const raw = require('choo/html/raw')
const asElement = require('prismic-element')
const { asText } = require('prismic-richtext')
const Component = require('nanocomponent')
const Nanocache = require('../base/utils/cache')
const serialize = require('../text/serialize')
const Twitter = require('../twitter')
const intro = require('../intro')
const Instagram = require('../instagram')
const card = require('../card')
const segment = require('../segment')
const quicklink = require('./quicklink')
const { className } = require('../base/utils')
const { href } = require('../../params')
const { __ } = require('../../locale')

/**
 * Map slice(s) to elements, layed out in a very smart grid
 * @param {object} state
 * @param {function} emit
 * @param {array} [items=null]
 */

module.exports = class Slices extends Component {
  constructor (id, state, emit) {
    super(id)
    this.state = state
    this.emit = emit
    this.cache = new Nanocache(state, emit)
  }

  static identity (key) {
    return `slices-${key}`
  }

  update () {
    return true
  }

  createElement (key, items, wrap = el => el) {
    const state = this.state

    /**
     * Group griddable slices in rows
     */

    let row = []
    const rows = []

    for (let slice, i = 0, len = items.length; i < len; i += 1) {
      slice = items[i]

      switch (slice.slice_type) {
        case 'link':
        case 'twitter':
        case 'instagram': {
          if (state[slice.slice_type] && state[slice.slice_type].error) {
            break
          }
          row.push(slice)
          break
        }
        default: {
          // Close on ungriddable slice
          rows.push(this.asRow(row))
          row = []
          rows.push(this.asCell(slice))
          break
        }
      }
    }

    // Add trailing row
    rows.push(this.asRow(row))

    // Filter out empty rows
    return html`
      <div>
        ${rows.filter(Boolean).map(wrap)}
      </div>
    `
  }

  /**
   * Map row of slices to grid cell elements
   *
   * @param {array} slices
   * @returns {Element}
   */

  asRow (slices) {
    if (!slices.length) return null

    /**
     * Group grid cells into rows of up to three cells
     */

    const rows = slices.slice().reverse().reduce((rows, slice, index) => {
      let row = rows[rows.length - 1]
      if (row.length === 3) {
        row = []
        rows.push(row)
      }
      row.push(slice)
      return rows
    }, [[]]).reverse()

    const total = rows.reduce((total, row) => total + row.length, 0)
    return html`
      <div class="Grid">
        ${rows.reduce((grid, row, index) => grid.concat(row.map((slice, place) => {
          const cols = row.length
          const classes = className('Grid-cell', {
            // The first cell in an uneven grid is full width to avoid orphans
            'Grid-cell--md1of2': cols >= 2 && !((total % 2) !== 0 && place === 0 && index === 0),
            'Grid-cell--lg1of2': cols === 2,
            'Grid-cell--lg1of3': cols === 3
          })

          return html`
            <div class="${classes}">
              ${this.asCell(slice, cols)}
            </div>
          `
        })), [])}
      </div>
    `
  }

  /**
   * Map slice object to Element
   *
   * @param {object} slice
   * @param {number} cols
   * @returns {Element}
   */

  asCell (slice, cols) {
    const { state, emit } = this

    switch (slice.slice_type) {
      /**
       * Picture with text
       */

      case 'segment': {
        return html`
          <ul class="Grid Grid--loose">
            ${slice.items.map((item, index) => html`
              <li class="Grid-cell Grid-cell--md1of2">
                ${segment(Object.assign({ id: index }, item))}
              </li>
            `)}
          </ul>
        `
      }

      /**
       * Rich text area
       */

      case 'text': return html`
        <div class="Text Text--growing">
          ${asElement(slice.primary.body, href, serialize)}
        </div>
      `

      /**
       * Quicklink
       */

      case 'quicklink': return quicklink({
        title: asText(slice.primary.title),
        body: asElement(slice.primary.body, href, serialize)
      })

      /**
       * Video embed (raw HTML inject)
       */

      case 'embed': {
        const embed = slice.primary.content.find(block => {
          return block.type === 'embed'
        })

        return html`
          <div class="Text Text--full">
            <div class="Text-embed">
              ${raw(embed.oembed.html)}
            </div>
          </div>
        `
      }

      /**
       * Twitter feed
       */

      case 'twitter': {
        const props = {
          user: process.env.TWITTER_USERNAME,
          hashtag: slice.primary.hashtag
        }

        let tweets
        if (props.hashtag) {
          tweets = state.twitter.items[props.hashtag]
        } else {
          tweets = state.twitter.items[props.user]
        }

        if (props.hashtag && state.twitter.items[props.hashtag] && (state.twitter.items[props.hashtag].length === 0)) {
          delete props.hashtag
          tweets = state.twitter.items[props.user]
        }

        return this.cache.render(Twitter, tweets, cols, props)
      }

      /**
       * Instagram feed
       */

      case 'instagram': {
        const props = {
          user: process.env.INSTAGRAM_USERNAME,
          hashtag: slice.primary.hashtag
        }

        let photos
        if (props.hashtag) {
          photos = state.instagram.items[props.hashtag]
        } else {
          photos = state.instagram.items[props.user]
        }

        return this.cache.render(Instagram, photos, cols, props)
      }

      /**
       * Generic link
       */

      case 'link': {
        const options = { sizes: ['small', 'medium', 'large'] }

        if (cols === 1) {
          options.sizes = ['small', 'medium', 'large']
          options.horizontal = true
        }

        if (cols <= 2) {
          options.sizes = ['small', 'medium']
          options.largeText = true
        }

        if (slice.primary.color) {
          options.fill = slice.primary.color
        }

        /**
         * Determine card content by link type
         */

        switch (slice.primary.link.link_type) {
          /**
           * Internal documents receieve special treatment
           */

          case 'Document': {
            switch (slice.primary.link.type) {
              case 'activity': {
                const doc = state.activities.items.find(item => {
                  return item.id === slice.primary.link.id
                })

                options.fill = true

                if (!doc) {
                  if (!state.activities.error) {
                    // Fetch missing content and render loading card
                    emit('activities:fetch', { uid: slice.primary.link.uid, critical: false })
                  }
                  return card.loading()
                }

                options.fill = doc.data.color || true

                return card(state, emit, activity(doc, slice.primary), options)
              }
              case 'news': {
                const doc = state.articles.items.find(item => {
                  return item.id === slice.primary.link.id
                })

                if (!doc) {
                  if (!state.articles.error) {
                    // Fetch missing content and render loading card
                    emit('articles:fetch', { uid: slice.primary.link.uid, critical: false })
                  }
                  return card.loading()
                }

                return card(state, emit, news(doc, slice.primary), options)
              }
              case 'page': {
                const doc = state.pages.items.find(item => {
                  return item.id === slice.primary.link.id
                })

                options.fill = true

                if (!doc) {
                  if (!state.pages.error) {
                    // Fetch missing content and render loading card
                    emit('pages:fetch', { uid: slice.primary.link.uid, critical: false })
                  }
                  return card.loading()
                }

                options.fill = doc.data.color || true

                return card(state, emit, page(doc, slice.primary), options)
              }

              /**
               * Default to null for unrecognized Document types
               */

              default: return null
            }
          }

          /**
           * Web link (external)
           */

          case 'Web': return card(state, emit, {
            title: slice.primary.title,
            image: slice.primary.image,
            body: slice.primary.body,
            href: slice.primary.link.url,
            link: slice.primary.link_text
          }, options)

          /**
           * Media item (external)
           */

          case 'Media': return card(state, emit, {
            title: slice.primary.title,
            image: slice.primary.image,
            body: slice.primary.body,
            file: slice.primary.link.url,
            link: slice.primary.link_text || __('Download')
          }, options)

          /**
           * Default to null for unrecognized link types
           */

          default: return null
        }
      }

      /**
       * Section header
       */

      case 'section_header': return intro({
        title: asText(slice.primary.title),
        body: asElement(slice.primary.introduction, href, serialize)
      })

      default: return slice
    }
  }
}

/**
 * Format news document as card props
 *
 * @param {object} doc
 * @param {object} props
 * @returns {object}
 */

function news (doc, props) {
  return Object.assign({
    title: doc.data.title,
    image: doc.data.image,
    body: doc.data.introduction || doc.data.body,
    tags: doc.tags,
    date: doc.data.original_publication_date || doc.first_publication_date,
    href: href(doc),
    link: __('Read more')
  }, defaults(props))
}

/**
 * Format activity document as card props
 *
 * @param {object} doc
 * @param {object} props
 * @returns {object}
 */

function activity (doc, props) {
  let url

  if (doc.data.redirect.link_type === 'Document') {
    url = href(doc.data.redirect)
  } else if (doc.data.redirect.link_type === 'Web') {
    url = doc.data.redirect.url
  } else if (doc.data.redirect.link_type === 'Media') {
    url = doc.data.redirect.url
  } else {
    url = href(doc)
  }

  return Object.assign({
    title: doc.data.title,
    image: doc.data.image,
    body: doc.data.introduction || doc.data.body,
    tags: doc.tags,
    href: url,
    link: __('Read more')
  }, defaults(props))
}

/**
 * Format page document as card props
 *
 * @param {object} doc
 * @param {object} props
 * @returns {object}
 */

function page (doc, props) {
  let url

  if (doc.data.redirect.link_type === 'Document') {
    url = href(doc.data.redirect)
  } else if (doc.data.redirect.link_type === 'Web') {
    url = doc.data.redirect.url
  } else if (doc.data.redirect.link_type === 'Media') {
    url = doc.data.redirect.url
  } else {
    url = href(doc)
  }

  return Object.assign({
    title: doc.data.title,
    image: doc.data.image,
    body: doc.data.introduction || doc.data.body,
    href: url,
    link: __('View page')
  }, defaults(props))
}

/**
 * Extract relevant (non-empty) values from link properties
 *
 * @param {object} props
 * @returns {object}
 */

function defaults (props) {
  const result = {}

  if (props.title.length && props.title[0].text) {
    result.title = props.title
  }

  if (props.image.src) {
    result.image = props.image
  }

  if (props.body.length && props.body.find(block => block.text)) {
    result.body = props.body
  }

  if (props.link_text) {
    result.link = props.link_text
  }

  return result
}
