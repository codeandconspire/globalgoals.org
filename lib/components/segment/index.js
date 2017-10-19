const html = require('choo/html');
const { asText } = require('prismic-richtext');
const asElement = require('prismic-element');

module.exports = (props, color = 'gray') => {
  return html`
    <div class="Segment" id="segment-${ props.id }">
      <figure class="Segment-figure">
        ${ props.caption ? html`<figcaption class="Segment-caption u-bg${ color }">${ props.caption }</figcaption>` : null }
        ${ props.image.url ? image(props.image, color) : html`
          <span class="Segment-fallback u-bg${ color }"><span class="Segment-fallbackText">${ props.fallback || null }</span></span>
        ` }
      </figure>
      <div class="Segment-body">
        <div class="Text">
          <h3 class="Text-h4">${ asText(props.title) }</h3>
          ${ asElement(props.body) }
        </div>
      </div>
    </div>
  `;
};

function image(props, color) {
  const { url, alt, dimensions: { width, height }} = props;
  const srcset = props['2x'] ? `${ props['2x'].url } 2x` : null;

  return html`
    <img class="Segment-image u-bg${ color }" src="${ url }" width="${ width }" height="${ height }" alt="${ alt || '' }" srcset="${ srcset }" />
  `;
}
