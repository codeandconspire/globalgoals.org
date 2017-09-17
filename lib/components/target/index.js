const html = require('choo/html');
const { asText } = require('prismic-richtext');
const component = require('fun-component');
const { __ } = require('../../locale');

const TRAILING_WORD = /\s\w+$/;

module.exports = function createTarget(id, goal) {
  return component({
    name: `target:${ id }`,
    limit: 120,
    isExpanded: false,
    canExpand: false,
    hasLoaded: false,
    update(element, [props], [prev]) {
      const hasChanged = props.id !== prev.id;

      if (hasChanged) {
        this.isExpanded = false;
      }

      return hasChanged;
    },
    load(element, props) {
      const pictogram = element.querySelector('.js-pictogram');
      const body = element.querySelector('.js-body');

      this.hasLoaded = true;

      if (body.offsetHeight - pictogram.offsetHeight > 60) {
        this.render(props);
      } else {
        while ((this.limit > 80) && (body.offsetHeight > pictogram.offsetHeight)) {
          this.limit -= 20;
          this.render(props);
        }
      }
    },
    render(props) {
      const onclick = event => {
        this.isExpanded = true;
        this.render(props);
        event.preventDefault();
      };

      let preamble = props.body.find(node => node.type === 'paragraph');

      if (preamble) {
        if (this.hasLoaded && preamble.text.length > this.limit && !this.isExpanded) {
          this.canExpand = true;

          preamble = html`
            <p>
              ${ preamble.text.substr(0, this.limit).replace(TRAILING_WORD, '…') }
              <br />
              <button class="Target-link" onclick=${ onclick }>${ __('Read all') }</button>
            </p>
          `;
        } else {
          preamble = html`<p>${ preamble.text }</p>`;
        }
      }

      return html`
        <div class="Target" onclick=${ this.canExpand ? onclick : '""' }>
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
              ${ preamble }
            </div>
          </div>
        </div>
      `;
    }
  });
};
