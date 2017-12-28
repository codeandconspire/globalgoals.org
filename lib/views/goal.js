const html = require('choo/html')
const asElement = require('prismic-element')
const { asText } = require('prismic-richtext')
const serialize = require('../components/text/serialize')
const view = require('../components/view')
const edit = require('../components/edit')
const layer = require('../components/layer')
const createHero = require('../components/hero')
const segment = require('../components/segment')
const createEngager = require('../components/engager')
const slices = require('../components/slices')
const { href } = require('../params')
const { __ } = require('../locale')

const GRID_SLICE = /link|twitter|instagram/
const GRID_SIZE = 6

const hero = createHero()
const engager = createEngager('goal')

module.exports = view('goal', goal, title)

function goal (state, emit) {
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

        if (grid.length < GRID_SIZE && !state.articles.fetched.includes(tag)) {
          emit('articles:fetch', { tags: [tag], critical: false })
        }
      }

      if (grid.length < GRID_SIZE) {
        grid.push(...state.activities.items.filter(item => {
          return item.tags.includes(tag)
        }).slice(0, GRID_SIZE - grid.length).map(asSlice))

        if (grid.length < GRID_SIZE && !state.activities.fetched.includes(tag)) {
          emit('activities:fetch', { tags: [tag], critical: false })
        }
      }

      /**
       * Add augumented grid back into copy of slices
       */

      body.splice(body.indexOf(grid[0]), length, ...grid)
    }
  }

  return html`
    <main class="View-main" id="view-main">
      ${hero(state, goal, emit, { background: !media })}

      ${media ? layer(media, onclose) : null}

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
          ${slices(state, emit, body.map(slice => {
            switch (slice.slice_type) {
              case 'call_to_action': return engager(state, emit, { doc,
                heading: {
                  title: asText(slice.primary.title),
                  introduction: asElement(slice.primary.introduction, href, serialize)
                }},
                goal
              )
              default: return slice
            }
          })).map(content => html`
            <section class="View-section">
              ${content}
            </section>
          `)}
        </div>
      ` : null}

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
