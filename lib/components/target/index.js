const html = require('choo/html');
const { asText } = require('prismic-richtext');
const asElement = require('prismic-element');
const { __ } = require('../../locale');

module.exports = (props, goal) => {
  return html`
    <div class="Target" id="target-${ props.id }">
      ${ props.pictogram.url ? html`
        <figure class="Target-pictogram">
          <figcaption class="Target-id u-bg${ goal }">${ __('Target %s', props.id) }</figcaption>
          <img class="Target-image u-bg${ goal }" src="${ props.pictogram.url }" width="${ props.pictogram.dimensions.width }" height="${ props.pictogram.dimensions.height }" alt="${ __('Pictogram for target %s', props.id) }" />
        </figure>
      ` : html`
        <figure class="Target-pictogram">
          <figcaption class="Target-id u-bg${ goal }">${ __('Target %s', props.id) }</figcaption>
          <span class="Target-fallback u-bg${ goal }"><span class="Target-fallbackText">${ __('Coming soon') }</span></span>
        </figure>
      ` }
      <div class="Target-body">
        <div class="Text">
          <h3 class="Text-h4">${ asText(props.title) }</h3>
          ${ asElement(props.body) }
        </div>
      </div>
    </div>
  `;
};
