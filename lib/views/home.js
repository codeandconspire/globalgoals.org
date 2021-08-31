const html = require('choo/html')
const asElement = require('prismic-element')
const { asText } = require('prismic-richtext')
const Component = require('nanocomponent')
const serialize = require('../components/text/serialize')
const view = require('../components/view')
const GoalGrid = require('../components/goal-grid')
const Engager = require('../components/engager')
const intro = require('../components/intro')
const Slices = require('../components/slices')
const edit = require('../components/edit')
const { href } = require('../params')

const GRID_SIZE = 6
const GRID_SLICE = /^link|page_link|twitter|instagram$/
const TOTAL_GOALS = 17

module.exports = class Home extends Component {
  constructor (id, state, emit) {
    super(id)
    this.createElement = view(id, home)
  }

  static identity () {
    return 'home'
  }

  update (state) {
    return !state.transitions.includes('takeover')
  }
}

function home (state, emit, render) {
  const { goals, pages } = state
  const doc = pages.items.find(item => item.type === 'home_page')

  if (!doc && !pages.isLoading) {
    emit('pages:fetch', { single: 'home_page' })
  }

  /**
   * Fetch missing goals
   */

  if (!goals.isLoading && !goals.error && goals.items.length !== TOTAL_GOALS) {
    const missing = []
    for (let i = 1; i <= TOTAL_GOALS; i += 1) {
      if (!goals.items.find(item => item.data.number === i)) {
        missing.push(i)
      }
    }

    emit('goals:fetch', { number: missing.filter(Boolean) })
  }

  const slices = doc && doc.data.body.slice()

  if (state.lang === 'en' && doc) {
    const grid = slices.filter(slice => GRID_SLICE.test(slice.slice_type))
    const length = grid.length
    if (length < GRID_SIZE) {
      const news = state.articles.items.slice(0, GRID_SIZE - grid.length)
      grid.push(...news.map(asSlice))
      if (grid.length < GRID_SIZE) emit('articles:fetch')
    }
    slices.splice(slices.indexOf(grid[0]), length, ...grid)
  }

  const classNames = [ 'View-main' ]
  if (state.transitions.includes('takeover')) {
    classNames.push('View-main--shrink')
  }

  return html`
    <main class="View-main u-transformTarget" id="view-main">



    <link
      rel="stylesheet"
      href="https://unpkg.com/swiper/swiper-bundle.min.css"
    />

    <style>
        html, body {
          margin: 0;
        }

        .container__slider {
          width: 100%;
          height: 100%;
          padding-left: 18px;
          padding-right: 18px;
          margin-right: auto;
          margin-left: auto;
          box-sizing: border-box;
          padding-top: 30px;
          padding-bottom: 30px;
          position: relative;
          z-index: 1;
        }
        @media (min-width: 480px) {
          .container__slider {
            padding-left: 24px;
            padding-right: 24px;
          }
        }
        @media (min-width: 1024px) {
          .container__slider {
            padding: 100px 32px;
          }
        }
        @media (min-width: 1250px) {
          .container__slider {
            max-width: calc(1280px + (48px * 2));
            padding: 100px 48px;
          }
        }
        .row__slider {
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -ms-flex-wrap: wrap;
          flex-wrap: wrap;
          /* margin-right: -15px;
          margin-left: -15px; */
          box-sizing: border-box;
          height: 100%;
        }

        .container__pagination,
        .row__pagination {
          height: auto;
          padding-top: 0;
          padding-bottom: 0;
        }

        .swiper-pagination-wrapper {
          position: absolute;
          bottom: 30px;
          left: 0;
          width: 100%;
        }
        @media (min-width: 992px) {
          .swiper-pagination-wrapper {
            bottom: 100px;
          }
        }
        .swiper-pagination {
          position: static;
          text-align: left;
        }
        .swiper-pagination.pagination__dark .swiper-pagination-bullet {
          border-color: #000;
        }
        .swiper-pagination.pagination__dark .swiper-pagination-bullet-active {
          background-color: #000;
        }


        .col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-10, .col-11, .col-12, .col, .col-auto, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm, .col-sm-auto, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-md, .col-md-auto, .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg, .col-lg-auto, .col-xl-1, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-10, .col-xl-11, .col-xl-12, .col-xl, .col-xl-auto {
          position: relative;
          width: 100%;
          /* padding-right: 15px;
          padding-left: 15px; */
          box-sizing: border-box;
        }

        @media (min-width: 768px) {
          .col-md-6 {
            -webkit-box-flex: 0;
            -ms-flex: 0 0 50%;
            flex: 0 0 50%;
            max-width: 50%;
          }
        }

        .swiper-pagination-bullet {
          width: 18px;
          height: 18px;
          border: 2px solid #fff;
          opacity: 1;
          border-radius: 0;
          background-color: transparent;
          transition: all .3s ease;
        }
        .swiper-pagination-bullet-active {
          background-color: #fff;
        }

        .swiper {
          width: 100%;
          height: 100%;
        }
        .global--goals__swiper-slider {
          height: 700px;
        }
        .global--goals__swiper-slider .swiper-wrapper {
          height: 100%;
        }

        .global--goals__swiper-slider .swiper-slide {
          color: #fff;
          height: 100%;
          /* Center slide text vertically */
          display: -webkit-box;
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
          -webkit-box-pack: center;
          -ms-flex-pack: center;
          -webkit-justify-content: center;
          justify-content: center;
          -webkit-box-align: center;
          -ms-flex-align: center;
          -webkit-align-items: center;
          align-items: center;
          -webkit-font-smoothing:antialiased;
	        -moz-osx-font-smoothing:grayscale;
        }

        .global--goals__swiper-slider .swiper-slide img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .fill__bg-image {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center center;
        }
        .d-flex {
          display: -webkit-box;
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
          flex-direction: column;
          -webkit-box-pack: space-between;
          -ms-flex-pack: space-between;
          -webkit-justify-content: space-between;
          justify-content: space-between;
          height: 100%;
        }
        .global--goals__swiper-slider h2 {
          font-family: "Giorgio Sans Bold", "AvenirNextCondensed-DemiBold", "HelveticaNeue-CondensedBold", "Helvetica Inserat", "Franklin Gothic Condensed", Haettenschweiler, Impact, sans-serif-condensed, sans-serif;
          font-size: 65px;
          line-height: 60px;
          margin-top: 0;
        }
        .global--goals__swiper-slider p {
          font-size: 20px;
          line-height: 30px;
        }
        .global--goals__swiper-slider .btn__wrapper {
          margin-top: 20px;
          margin-bottom: 50px;
        }
        .global--goals__swiper-slider .btn__wrapper a {
          font-family: "Giorgio Sans Bold", "AvenirNextCondensed-DemiBold", "HelveticaNeue-CondensedBold", "Helvetica Inserat", "Franklin Gothic Condensed", Haettenschweiler, Impact, sans-serif-condensed, sans-serif;
          padding: 10px 22px;
          color: #fff;
          border: 3px solid #ffffff;
          font-size: 22px;
          line-height: 30px;
          text-transform: uppercase;
          display: inline-block;
          text-decoration: none !important;
          transition: all .3s ease;
        }
        .global--goals__swiper-slider .btn__wrapper a:hover {
          background-color: #ffffff;
          color: #000000;
        }

        .global--goals__swiper-slider .swiper-slide.swiper-slide__dark {
          color: #000000;
        }
        .global--goals__swiper-slider .swiper-slide__dark .btn__wrapper a {
          color: #000;
          border: 3px solid #000;
        }
        .global--goals__swiper-slider .swiper-slide__dark .btn__wrapper a:hover {
          background-color: #000;
          color: #fff;
        }
      </style>
</head>
<body>

    <div class="swiper global--goals__swiper-slider">
        <div class="swiper-wrapper">
          <div class="swiper-slide fill__bg-image" style="background-image: url(https://globalgoals-hero.hostingarea10.co.uk/img/1.jpg);">
            <div class="container__slider">
                <div class="row__slider">
                    <div class="col-md-6">
                        <div class="d-flex">
                            <div>
                                <h2>WHY THE GOALS MATTER TO THE FASHION INDUSTRY</h2>
                                <p>Now is the time for the fashion industry and its consumers to come together in tackling these systemic challenges that can no longer be ignored.</p>
                            </div>
                            <div class="btn__wrapper">
                                <a href="/news/goals-goals-and-fashion-industry">Find out more</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
          <div class="swiper-slide swiper-slide__dark fill__bg-image" style="background-image: url(https://globalgoals-hero.hostingarea10.co.uk/img/2.jpg);">
            <div class="container__slider">
                <div class="row__slider">
                    <div class="col-md-6">
                        <div class="d-flex">
                            <div>
                                <h2>FASHION AVENGERS</h2>
                                <p>Fashion Avengers is a collection of leading fashion industry forces coming together to inspire and accelerate progress towards the United Nations' Global Goals.</p>
                            </div>
                            <div class="btn__wrapper">
                                <a href="/news/fashion-avengers">Find out more</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
          <div class="swiper-slide fill__bg-image" style="background-image: url(https://globalgoals-hero.hostingarea10.co.uk/img/3.jpg);">
            <div class="container__slider">
                <div class="row__slider">
                    <div class="col-md-6">
                        <div class="d-flex">
                            <div>
                                <h2>EXPERIENCE THE <br/>
                                    GLOBAL GOALS IN AR</h2>
                                <p>We are pleased to be partnering with Google Arts & Culture to bring the Global Goals to everyone.</p>
                            </div>
                            <div class="btn__wrapper">
                                <a href="/news/experience-the-global-goals-in-ar">Find out more</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>

        <div class="swiper-pagination-wrapper">
          <div class="container__slider container__pagination">
            <div class="row__slider row__pagination">
              <div class="col-12">
                <div class="swiper-pagination"></div>
              </div>
            </div>
          </div>
        </div>

      </div>

    <script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>



      <section class="View-section" id="goals">
        ${getIntro()}
        ${render(GoalGrid, doc)}
      </section>

      ${doc ? render(Slices, doc.id, slices.map(slice => {
        switch (slice.slice_type) {
          case 'call_to_action': return render(Engager, doc, {
            title: asText(slice.primary.title),
            introduction: asElement(slice.primary.introduction, href, serialize)
          })
          default: return slice
        }
      }), content => html`
        <section class="View-section">
          ${content}
        </section>
      `) : null}

      ${edit(state, doc)}
    </main>
  `

  function getIntro () {
    if (doc && 'data' in doc) {
      return intro({
        title: asText(doc.data.title),
        body: asElement(doc.data.introduction, href, serialize),
        pageIntro: true
      })
    } else {
      return intro({ loading: true, pageIntro: true })
    }
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
