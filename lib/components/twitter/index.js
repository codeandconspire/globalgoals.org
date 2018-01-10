const html = require('choo/html')
const Component = require('nanocomponent')
const { __ } = require('../../locale')
const { inBrowser } = require('../base/utils')

module.exports = class Twitter extends Component {
  constructor (id, state, emit) {
    super(id)
    this.state = state
    this.emit = emit
    this.locals = this.state.twitter
  }

  static identity (tweets, cols, { user, hashtag }) {
    return ['twitter', user, hashtag].join('-')
  }

  update (tweets) {
    return tweets !== this.tweets
  }

  createElement (tweets, cols, { user, hashtag }) {
    this.tweets = tweets

    if (!tweets && inBrowser && !this.locals.isLoading) {
      this.emit('twitter:fetch', { user, hashtag })
    }

    let link = 'https://twitter.com/'
    let linkText

    if (hashtag) {
      link = link + `search?q=${encodeURIComponent(hashtag)}`
      linkText = hashtag.replace(/^#?/, '#')
    } else {
      link = link + user
      linkText = '@' + user
    }

    return html`
      <article class="Card Card--fill">
        <div class="Card-content u-bgTwitter">
          <div class="Card-body">
            <div class="Twitter Twitter--size${cols}">
              <svg class="Twitter-icon" viewBox="0 0 36 30" width="36" height="30">
                <path d="M31.8 8.5v-1c1.4-1 2.7-2.4 3.7-4-1.3.7-2.8 1-4.2 1.2 1.5-1 2.6-2.4 3.2-4-1.4.7-3 1.4-4.6 1.7C28.3 1 26.4 0 24.3 0c-4 0-7.2 3.4-7.2 7.6 0 .6 0 1 .2 1.7-6-.3-11.4-3.3-15-8-.7 1.2-1 2.5-1 4 0 2.5 1.3 4.8 3.2 6.2-1.2 0-2.3-.4-3.3-1 0 3.8 2.5 7 6 7.6l-2 .4H4c1 3 3.6 5 6.8 5.2-2.5 2-5.7 3.2-9 3.2H0c3.2 2 7 3.3 11.2 3.3 13.3 0 20.6-11.4 20.6-21.4z" fill="#FFF" fill-rule="evenodd"/>
              </svg>

              <a class="Twitter-heading" href="${link}" target="_blank" rel="noopener noreferrer">${linkText}</a>

              <div class="Twitter-container">
                ${tweets ? tweets.map(tweet => {
                  const user = tweet.user.screen_name
                  const date = new Date(tweet.created_at)
                  const datetime = JSON.stringify(date).replace(/"/g, '')

                  return html`
                    <section class="Twitter-tweet">
                      <a class="Twitter-user" href="https://twitter.com/${user}" rel="noopener noreferrer" target="_blank">@${user}</a>
                      <a class="Twitter-link" href="https://twitter.com/${user}/status/${tweet.id_str}" rel="noopener noreferrer" target="_blank">
                        <time class="Twitter-date" datetime="${datetime}">${time(+date)}</time>
                      </a>
                      <p class="Twitter-text">${text(tweet)}</p>
                    </section>
                  `
                }) : [1, 2, 3, 4, 5, 6].map(() => {
                  return html`
                    <div class="Twitter-tweet">
                      <span class="Twitter-user"><span class="u-loadingOnColor">${__('LOADING_TEXT_SHORT')}</span></span>
                      <p class="Twitter-text"><span class="u-loadingOnColor">${__('LOADING_TEXT_LONG')}</span></p>
                    </div>
                  `
                })}
              </div>
            </div>
          </div>

          <a class="Card-link" href="${link}" target="_blank" rel="noopener noreferrer">
            <span class="Card-linkText">${__('See all Tweets')} <span class="Card-arrow"></span></span>
          </a>
        </div>
      </article>
    `
  }
}

/**
 * Compile tweet text interpolating link entities
 * @param {object} tweet
 * @returns {array}
 */

function text (tweet) {
  const { hashtags, user_mentions, urls } = tweet.entities

  /**
   * Only use entities before the 140 character mark
   */

  const parts = hashtags.concat(user_mentions, urls).sort((a, b) => {
    return a.indices[0] < b.indices[0] ? -1 : 1
  })

  /**
   * Compile links
   */

  let text = []
  let char = 0
  parts.filter(part => part.indices[1] <= 140).forEach(part => {
    let href, link

    if (part.screen_name) {
      link = '@' + part.screen_name
      href = `https://twitter.com/${part.screen_name}`
    } else if (part.url) {
      link = part.display_url
      href = part.expanded_url
    } else {
      link = '#' + part.text
      href = `https://twitter.com/search?q=${encodeURIComponent('#' + part.text)}`
    }

    text.push(
      format(tweet.text.substring(char, part.indices[0])),
      html`<a href="${href}" target="_blank" rel="noopener noreferrer">${link}</a>`
    )

    char = part.indices[1]
  })

  /**
   * Add on trailing content exluding entities before the 140 character mark
   */

  if (tweet.text.length > char) {
    const last = parts.find(part => part.indices[1] > 140)

    text.push(format(tweet.text.substring(char, last ? last.indices[0] : 140)))

    if (tweet.text.length > 140 && !/…$/.test(text[text.length - 1])) {
      text.push('…')
    }
  }

  return text
}

/**
 * Format tweet text replacing encoded cahracters
 * @param {string} text
 * @returns {string}
 */

function format (text) {
  return text.replace(/&amp;/, '&')
}

/**
 * Format tweet timestamp as time from now
 * @param {Date} date
 * @returns {string}
 */

function time (date) {
  const now = Date.now()
  const isHours = ((now - date) < (1000 * 60 * 60 * 24))
  const isMinutes = ((now - date) < (1000 * 60 * 60))
  const isSeconds = ((now - date) < (1000 * 60))

  if (isSeconds) {
    return __('Just now')
  }

  if (isMinutes) {
    return __('%s min ago', Math.floor((now - date) / (1000 * 60)))
  }

  if (isHours) {
    return __('%s hours ago', Math.floor((now - date) / (1000 * 60 * 60)))
  }

  return __('%s days ago', Math.floor((now - date) / (1000 * 60 * 60 * 24)))
}
