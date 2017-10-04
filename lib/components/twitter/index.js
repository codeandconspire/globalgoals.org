const html = require('choo/html');
const component = require('fun-component');
const { __ } = require('../../locale');

module.exports = component({
  name: 'twitter',
  update(element, [tweets,, { user, hashtag }], [last,, prev]) {
    return tweets !== last || user !== prev.user || hashtag !== prev.hashtag;
  },
  render(tweets, emit, { user, hashtag }) {
    if (!tweets && typeof window !== 'undefined') {
      emit('twitter:fetch', hashtag);
    }

    return html`
      <div class="Twitter">
        <a href="https://twitter.com/${ user }">Follow us</a>
        ${ tweets ? html`
          <ul>
            ${ tweets.map(tweet => {
              const user = tweet.user.screen_name;
              const date = new Date(tweet.created_at);

              return html`
                <li class="Text">
                  <a href="https://twitter.com/${ user }">@${ user }</a>
                  <time datetime="${ JSON.stringify(date) }">${ time(+date) }</time>
                  ${ text(tweet) }
                </li>
              `;
            }) }
          </ul>
        ` : html`
        ` }
        ${ hashtag.replace(/^#?/, '#') }
      </div>
    `;
  }
});

function text(tweet) {
  const { hashtags, user_mentions } = tweet.entities;

  const parts = hashtags.concat(user_mentions).sort((a, b) => {
    return a.indices[0] < b.indices[0] ? -1 : 1;
  });

  let text = [];
  let char = 0;
  for (const part of parts) {
    let href;
    if (part.screen_name) {
      href = `/${ part.screen_name }`;
    } else {
      href = `/search?q=${ encodeURIComponent('#' + part.text) }`;
    }

    text.push(
      tweet.text.substring(char, part.indices[0]),
      html`<a href="https://twitter.com${ href }">
        ${ part.screen_name ? '@' : '#' }${ part.screen_name || part.text }
      </a>`
    );

    char = part.indices[1];
  }

  return text;
}

function time(date) {
  const now = Date.now();
  const isHours = ((now - date) < (1000 * 60 * 60 * 24));
  const isMinutes = ((now - date) < (1000 * 60 * 60));
  const isSeconds = ((now - date) < (1000 * 60));

  if (isSeconds) {
    return __('%s sec ago', Math.floor((now - date) / 1000));
  }

  if (isMinutes) {
    return __('%s min ago', Math.floor((now - date) / (1000 * 60)));
  }

  if (isHours) {
    return __('%s hours ago', Math.floor((now - date) / (1000 * 60 * 60)));
  }

  return __('%s days ago', Math.floor((now - date) / (1000 * 60 * 60 * 24)));
}
