const html = require('choo/html');
const { asText } = require('prismic-richtext');
const asElement = require('prismic-element');
const component = require('fun-component');
const { __ } = require('../../locale');

module.exports = function createTarget(id, goal) {
  return component({
    name: `target:${ id }`,
    render(props) {
      return html`
        <div class="Target" id="target-${ props.id }">
          ${ props.pictogram.url ? html`
            <figure class="Target-pictogram js-pictogram">
              <img class="Target-image u-bg${ goal }" src="${ props.pictogram.url }" width="${ props.pictogram.dimensions.width }" height="${ props.pictogram.dimensions.height }" alt="${ __('Pictogram for target %s', props.id) }" />
              <figcaption class="Target-id u-bg${ goal }">${ __('Target %s', props.id) }</figcaption>
            </figure>
          ` : html`
            <div class="Target-pictogram Target-pictogram--fallback js-pictogram u-bg${ goal }">
              <span class="Target-id">${ __('Target') } <span class="Target-idStrong">${ props.id }</span></span>
            </div>
          ` }
          <div class="Target-body js-body">
            <div class="Text">
              <h3 class="Text-h4">${ asText(props.title) }</h3>
              ${ asElement(props.body) }
            </div>
          </div>
        </div>
      `;
    }
  });
};
