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

  let href;
  if (props.link.url) {
    href = props.link.url;
  } else {
    href = resolve(state.routes.media, params);

    if (!href) {
      href = resolve(state.routes.goal, params);
    }
  }

  const img = image(props.image, [ 'small', 'medium' ]);
  let id = props.slug;
  if (!id && props.link.url) {
    const filename = props.link.url.match(/\/([^/]*?)(?=\.\w+$)/);
    id = filename ? `poster-${ filename[1] }` : null;
  }

  return html`
    <article class="CallToAction-poster" id="${ id }" onclick=${ onclick }>
      ${ props.image.url ? html`
        <figure class="CallToAction-imageWrapper">
          <img class="CallToAction-image" src="${ img.src }" alt="${ props.image.alt || '' }" width="${ img.width }" height="${ img.height }" srcset="${ img.srcset }" sizes="${ img.sizes }" />
          <figcaption class="u-hiddenVisually">${ asText(props.title) }</figcaption>
        </figure>
      ` : null }
      ${ props.link.url ? html`
        <a class="CallToAction-share" href="${ href }" download>
          <svg viewBox="0 0 32 32" width="32" height="32" class="CallToAction-shareIcon">
            <g fill="none" fill-rule="evenodd">
              <circle fill="#10BDE4" cx="16" cy="16" r="16"/>
              <path d="M11.38 22.13H21v1h-9.6zm4.37-4.36l-4.4-4.4-.63.64 5.47 5.5 5.44-5.5-.64-.62-4.4 4.4V9h-.86v8.77z" fill="#FFF"/>
            </g>
          </svg>
          ${ __('Download') }
        </a>
      ` : html`
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
      ` }
    </article>
  `;

  function onclick(event) {
    if (props.link.url) {
      window.location.assign(href);
    } else if (!state.ui.share) {
      emit('ui:share:toggle', {
        href,
        title: asText(props.title).trim(),
        image: props.image.small.url,
        asset: props.link.url || props.image.url,
        description: asText(props.description).trim()
      });
    }

    event.preventDefault();
  }
};
