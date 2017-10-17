const html = require('choo/html');
const card = require('../card');
const { href } = require('../../params');
const { __ } = require('../../locale');

const TAG_REGEX = /^goal-(\d{1,2})$/;

module.exports = function (state, doc, emit) {
  const organisations = state.pages.items.filter(item => {
    const isOrg = item.tags.includes('organisation');

    if (doc.type === 'goal') {
      return isOrg && item.tags.find(tag => {
        const match = tag.match(TAG_REGEX);
        return match && parseInt(match[1], 10) === doc.data.number;
      });
    }

    return isOrg;
  });

  return html`
    <div class="Grid" id="call-to-action-organisations-content">
      ${ state.pages.isLoading ? Array.from('123').map((index) => html`
        <div class="Grid-cell Grid-cell--md1of2 Grid-cell--lg1of3 Grid-cell--appear" style="animation-delay: ${ +index * 100 }ms;">
          ${ card.loading({ fill: true }) }
        </div>
      `) : organisations.map((item, index) => html`
        <div class="Grid-cell Grid-cell--md1of2 Grid-cell--lg1of3 Grid-cell--appear" id="${ doc.id }-organisation-${ index }" style="animation-delay: ${ index * 100 }ms;">
          ${ card(state, emit, asCard(item), { fill: true }) }
        </div>
      `) }
    </div>
  `;

  function asCard(doc) {
    return {
      title: doc.data.title,
      image: doc.data.image,
      body: doc.data.introduction,
      tags: doc.tags,
      href: href(state, doc),
      link: __('Read more')
    };
  }
};
