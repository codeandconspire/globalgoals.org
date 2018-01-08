const html = require('choo/html')
const asElement = require('prismic-element')
const { asText } = require('prismic-richtext')
const serialize = require('../components/text/serialize')
const view = require('../components/view')
const edit = require('../components/edit')
const Layer = require('../components/layer')
const Hero = require('../components/hero')
const segment = require('../components/segment')
const Engager = require('../components/engager')
const Slices = require('../components/slices')
const { href } = require('../params')
const { __ } = require('../locale')

const GRID_SLICE = /link|twitter|instagram/
const GRID_SIZE = 6

module.exports = view('goal', goal, title)

function goal (state, emit, render) {
  const { goal } = state.params
  const doc = state.goals.items.find(item => item.data.number === goal)

  /**
   * Fetch missing goal
   */

  if (!doc) {
    emit('goals:fetch', { number: goal })
    return html`<main class="View-main" id="view-main"></main>`
  }

  /**
   * Redirect to complete url
   */

  if (doc && !state.params.slug) {
    window.history.replaceState({}, null, href(doc))
  }

  let media
  if (doc && state.params.media) {
    media = doc.data.media.find(item => item.slug === state.params.media)

    if (!media) {
      const error = new Error('Image could not be found')
      error.status = 404
      throw error
    }
  }

  /**
   * Make a copy of the document slices
   */

  const body = doc && doc.data.body.slice()

  if (body) {
    /**
     * Isolate slices that are "griddable"
     */

    const grid = body.filter((slice, index) => {
      return GRID_SLICE.test(slice.slice_type)
    })

    const length = grid.length

    if (length) {
      const tag = `goal-${goal}`

      /**
       * Fill up grid with articles and activites tagged with goal
       */

      if (grid.length < GRID_SIZE) {
        grid.push(...state.articles.items.filter(item => {
          return item.tags.includes(tag)
        }).slice(0, GRID_SIZE - grid.length).map(asSlice))

        if (grid.length < GRID_SIZE && !state.articles.tags.includes(tag)) {
          emit('articles:fetch', { tags: [tag], critical: false })
        }
      }

      if (grid.length < GRID_SIZE) {
        grid.push(...state.activities.items.filter(item => {
          return item.tags.includes(tag)
        }).slice(0, GRID_SIZE - grid.length).map(asSlice))

        if (grid.length < GRID_SIZE && !state.activities.tags.includes(tag)) {
          emit('activities:fetch', { tags: [tag], critical: false })
        }
      }

      /**
       * Add augumented grid back into copy of slices
       */

      body.splice(body.indexOf(grid[0]), length, ...grid)
    }
  }

  const cta = body.find(slice => slice.slice_type === 'call_to_action')

  return html`
    <main class="View-main" id="view-main">
      ${render(Hero, doc)}

      ${doc && doc.data.manifest ? html`
        <section class="View-section u-transformTarget" id="manifest">
          <div class="Space Space--manifest">
            <div class="Text Text--full">
              <div class="Text-large Text-firstMarginNone Text-lastMarginNone">
                ${asElement(doc.data.manifest, href, serialize)}
              </div>
            </div>
          </div>
        </section>
      ` : null}

      ${body ? html`
        <div class="u-transformTarget">
          ${render(Slices, doc.id, body.filter(slice => slice.slice_type !== 'call_to_action'), content => html`
            <section class="View-section">
              ${content}
            </section>
          `)}
        </div>
      ` : null}

      ${doc && doc.data.targets.length ? html`
        <section class="View-section u-transformTarget" id="targets">
          <div class="Space Space--contain Space--start Space--end">
            <div class="Text Text--growing">
              <h2 class="Text-h2">${asText(doc.data.targets_title)}</h2>
              <p>${asText(doc.data.targets_introduction)}</p>
            </div>
          </div>
          <ul class="Grid Grid--loose">
            ${doc.data.targets.map(props => html`
              <li class="Grid-cell Grid-cell--md1of2">
                ${segment(Object.assign({
                  image: props.pictogram,
                  caption: __('Target %s', props.id),
                  fallback: __('Coming soon')
                }, props), goal)}
              </li>
            `)}
          </ul>
        </section>
      ` : null}

      ${body ? html`
        <div class="u-transformTarget">
        <section class="View-section">
          ${cta ? render(Engager, doc, {
            title: asText(cta.primary.title),
            introduction: asElement(cta.primary.introduction, href, serialize)
          }) : null}
          </section>
        </div>
      ` : null}

      ${media ? render(Layer, media, onclose) : null}

      ${edit(state, doc)}
    </main>
  `

  function onclose () {
    emit(state.events.PUSHSTATE, href(doc))
  }
}

function asSlice (doc) {
  return {
    slice_type: 'link',
    primary: {
      link: Object.assign({ link_type: 'Document' }, doc),
      title: doc.data.title,
      body: doc.data.introduction,
      image: doc.data.image,
      color: doc.data.color || null
    }
  }
}

function title (state) {
  if (state.goals.isLoading) { return __('LOADING_TEXT_SHORT') }

  const num = state.params.goal
  const doc = state.goals.items.find(item => item.data.number === num)

  return `${__('Goal %s', doc.data.number)}: ${asText(doc.data.title)}`
}
