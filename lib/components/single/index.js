const url = require('url');
const html = require('choo/html');
const { asText } = require('prismic-richtext');
const asElement = require('prismic-element');
const tags = require('../tags');
const createLink = require('../goal-grid/link');
const { className, image } = require('../base/utils');
const { resolve, href } = require('../../params');
const { __ } = require('../../locale');

var ROOT = process.env.GLOBALGOALS_URL;
const TAG_REGEX = /^goal-(\d{1,2})$/;

const goalLinks = [];

module.exports = function single(state, emit, doc, opts = {}) {
  const date = new Date(doc.data.original_publication_date || doc.first_publication_date);
  const img = doc.data.image.url ? image(doc.data.image, ['small', 'medium', 'large']) : null;
  const taggedGoals = doc.tags
    .map(tag => tag.match(TAG_REGEX))
    .filter(Boolean)
    .map(match => parseInt(match[1], 10));

  const goals = [];
  if (!doc.tags.includes('organisation')) {
    for (const tag of taggedGoals) {
      const goal = state.goals.items.find(item => item.data.number === tag);
      if (!goal) {
        emit('goals:fetch', tag);
      }
      goals.push(goal || tag);
    }
  }

  const links = doc.data.links.filter(props => getHref(props.link));

  return html`
    <div class="Single">
      ${ img ? html`
        <div class="View-section View-section--fullOnSmall">
          <figure class="Single-banner">
            <img class="Single-bannerFigure" src="${ img.src }" alt="${ img.alt }" width="${ img.width }" height="${ img.height }" srcset="${ img.srcset }" sizes="${ img.sizes }" />
          </figure>
        </div>
      ` : null }

      <div class="View-section">
        <div class="${ className('Single-body', { 'Single-body--pullUp': doc.data.image.url }) }">
          <article class="Single-column Single-column--main">
            ${ opts.showDate ? html`
              <time class="Single-date" datetime="${ JSON.stringify(date) }">
                <span class="Text Text--growing Text--muted">
                  ${ __('Published on %s %s, %s', __(`MONTH_${ date.getMonth() }`), date.getDate(), date.getFullYear()) }
                </span>
              </time>
            ` : null }

            <div class="Text Text--growing">
              <h1 class="Text-marginTopNone">${ asText(doc.data.title) }</h1>

              ${ doc.data.introduction ? html`
                <div class="Text-large">
                  ${ asElement(doc.data.introduction, doc => href(state, doc)) }
                </div>
              ` : null }
              ${ doc.data.body ? asElement(doc.data.body, doc => href(state, doc)) : null }
            </div>
          </article>

          <aside class="Single-column Single-column--sidebar">

            ${ goals.length ? html`
              <div class="Single-block Single-block--inset">
                <div class="${ className('Single-tags', { 'Single-tags--single': goals.length === 1 }) }">
                  ${ goals.length === 1 ? html`
                    <div class="GoalGrid GoalGrid--simple">
                      ${ goals.map(item => {
                        const hasDoc = item && item.id;
                        const number = typeof item === 'number' ? item : item.data.number;

                        if (!goalLinks[number]) {
                          goalLinks[number] = createLink(state, number, emit);
                        }

                        return goalLinks[number](hasDoc ? item : null);
                      }) }
                    </div>
                  ` : tags(goals.map(item => ({
                    href: item.id ? href(state, item) : resolve(state.routes.goal, { goal: item, referrer: state.params.referrer }),
                    number: item.id ? item.data.number : item
                  }))) }
                </div>

                <div class="Text">
                  <small class="Text-muted">
                    <strong>${ asText(doc.data.title) }</strong>
                    ${ __('is associated with') }
                    ${ goals.map(item => {
                      return item.id ? html`<em>${ __('Goal %s', item.data.number) } – ${ asText(item.data.title) }</em>` : __('LOADING_TEXT_SHORT');
                    }).reduce((text, title, index, list) => {
                      const offset = list.length - 1 - index;
                      return text.concat(title, (offset ? (offset === 1 ? ' and ' : ', ') : ''));
                    }, []) }
                  </small>
                </div>

              </div>
            ` : null }

            <div class="Single-block Single-block--group">
              <div class="Single-block">
                <div class="Text">
                  <h2 class="Text-h4">${ __('Spread the word') }</h2>
                </div>

                <button class="Single-link Single-link--plain" onclick=${ onclick }>
                  <svg class="Single-linkIcon" viewBox="0 0 48 48" width="48" height="48">
                    <g fill="none" fill-rule="evenodd">
                      <circle cx="24" cy="24" r="24" fill="#10BDE4"/>
                      <g stroke="#FFF">
                        <path d="M27.5 21.5h4v11h-14v-11h4m3-8v13"/>
                        <path d="M24.5 13l-4 4m4-4l4 4" stroke-linecap="square"/>
                      </g>
                    </g>
                  </svg>
                  ${ __('Share with others') }
                </button>

                <a class="Single-link Single-link--plain" href="mailto:?subject=${ asText(doc.data.title).trim() }&body=${ asText(doc.data.introduction).trim() } ${ url.resolve(ROOT, href(state, doc)).replace(/\/$/, '') }">
                  <svg class="Single-linkIcon" viewBox="0 0 48 49" width="48" height="48">
                    <g fill="none" fill-rule="evenodd">
                      <circle fill="#B1B4BD" cx="24" cy="24" r="24"/>
                      <path d="M14 17.5c-.3 0-.5.2-.5.5v12.5c0 .3.2.5.5.5h20c.3 0 .5-.2.5-.5V18c0-.3-.2-.5-.5-.5H14z" stroke="#FFF"/>
                      <path d="M24 26.5l9.7-8.5M27 24l6.6 6.7m-13-6.7L14 30.7m10-4.3L14 18" stroke="#FFF" stroke-linecap="square"/>
                    </g>
                  </svg>
                  ${ __('Email to a friend') }
                </a>
              </div>

              ${ links.length ? html`
                <div class="Single-block">
                  <div class="Text">
                    <h2 class="Text-h4">${ __('Find out more') }</h2>
                  </div>

                  <ul class="Single-list">
                    ${ links.map(props => {
                      const href = getHref(props.link);

                      if (!href) { return null; }

                      return html`
                        <li class="Single-link">
                          <a href="${ href }">${ props.text }</a>
                        </li>
                      `;
                    }) }
                  </ul>
                </div>
              ` : null }
            </div>
          </aside>
        </div>
      </div>
    </div>
  `;

  function onclick() {
    const { title, image, introduction } = doc.data;

    emit('ui:share:toggle', {
      href: href(state, doc),
      title: asText(title).trim(),
      image: (image.small && image.small.url) || image.url,
      description: asText(introduction).trim()
    });
  }

  function getHref(data) {
    switch (data.link_type) {
      case 'Web': return data.url;
      case 'Document': return data.isBroken ? null : href(state, data);
      case 'Media': return data.url;
      default: return null;
    }
  }
};
