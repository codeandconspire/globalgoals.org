const html = require('choo/html');
const { asText } = require('prismic-richtext');
const { image } = require('../base/utils');
const { resolve } = require('../../params');
const { __ } = require('../../locale');

module.exports = function poster(state, goal, props, emit) {
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

  const img = image(props.image, [ 'small', 'medium' ]);

  return html`
    <article class="CallToAction-poster" onclick=${ onclick }>
      ${ props.image.url ? html`
        <figure>
        <img class="CallToAction-image" src="${ img.src }" alt="${ props.image.alt || '' }" width="${ img.width }" height="${ img.height }" srcset="${ img.srcset }" sizes="${ img.sizes }" />
          <figcaption class="u-hiddenVisually">${ asText(props.title) }</figcaption>
        </figure>
      ` : null }
      <a class="CallToAction-share" href="${ href }" onclick=${ onclick }>
        <svg viewBox="0 0 32 32" width="32" height="32" class="CallToAction-shareIcon">
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

  function onclick(event) {
    if (state.ui.share) { return; }

    emit('ui:share:toggle', {
      href,
      title: asText(props.title).trim(),
      image: props.image.small.url,
      asset: props.image.url,
      description: asText(props.description).trim()
    });

    event.preventDefault();
  }
};
