const html = require('choo/html');
const { asText } = require('prismic-richtext');
const { resolve } = require('../../params');
const { __ } = require('../../locale');

module.exports = function message(state, goal, props) {
  const params = {
    goal: goal.data.number,
    slug: goal.uid,
    referrer: state.params.referrer,
    media: props.slug
  };

  let href = resolve(state.routes.media, Object.assign({
    media: props.slug
  }, params));

  if (!href) {
    href = resolve(state.routes.goal, params);
  }

  return html`
    <article class="CallToAction-message">
      ${ props.image.url ? html`
        <figure>
          ${ image(props.image) }
          <figcaption class="u-hiddenVisually">${ asText(props.title) }</figcaption>
        </figure>
      ` : null }
      <a class="CallToAction-share" href="${ href }">
        <svg viewBox="0 0 32 32" width="32" height="32">
          <g fill="none" fill-rule="evenodd">
            <circle fill="#10BDE4" cx="16" cy="16" r="16"/>
            <path stroke="#FFF" d="M18.14 14H21v8H11v-8h2.856M16 8v10"/>
            <path d="M15.933 8L13 11m3-3l2.933 3" stroke="#FFF" stroke-linecap="square"/>
          </g>
        </svg>
        ${ __('Share image') }
      </a>
    </article>
  `;
};

function image(props) {
  const srcset = `${ props.url } 1x, ${ props['2x'].url } 2x`;
  const width = props.dimensions.width;
  const height = props.dimensions.height;

  return html`<img class="CallToAction-image" src="${ props.url }" alt="${ props.alt }" width="${ width }" height="${ height }" srcset="${ srcset }" />`;
}
