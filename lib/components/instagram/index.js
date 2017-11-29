const html = require('choo/html')
const component = require('fun-component')
const { __ } = require('../../locale')
const { inBrowser } = require('../base/utils')

module.exports = component({
  name: 'instagram',
  update (element, [photos,, { user, hashtag }], [last,, prev]) {
    return photos !== last || user !== prev.user || hashtag !== prev.hashtag
  },
  render (photos, cols, emit, { user, hashtag }) {
    if (!photos && inBrowser) {
      emit('instagram:fetch', { user, hashtag })
    }

    let link = 'https://instagram.com/'
    let linkText

    if (hashtag) {
      link = link + `explore/tags/${hashtag.replace(/^#?/, '')}`
      linkText = hashtag.replace(/^#?/, '#')
    } else {
      link = link + user
      linkText = '@' + user
    }

    return html`
      <article class="Card Card--fill">
        <div class="Card-content u-bgGrayDark">
          <div class="Card-body">
            <div class="Instagram Instagram--size${cols}">
              <svg class="Instagram-icon" viewBox="0 0 504 504">
                <g fill="none" fill-rule="evenodd">
                  <path fill="currentColor" d="M252 .2c-68.5 0-77 .2-104 1.5-26.8 1.2-45 5.5-61 11.7-16.7 6.4-30.7 15-44.7 29-14 14-22.6 28-29 44.7-6.3 16-10.7 35-12 62C.3 176 0 185 0 253s0 77 1 103.7C2.4 383 7 401 13 417c6.6 16.7 15 30.7 29 44.7 14 14 28 22.6 44.8 29 16 6.3 34.2 10.6 61 11.8 27 1.2 35.5 1.5 104 1.5 68.3 0 77-.3 103.8-1.5 26.8-1.2 45-5.5 61-11.7 16.7-6.5 30.8-15 44.8-29 14-14 22.6-28 29-44.7 6.2-16 10.5-34 11.7-61 2-27 2-35 2-104 0-68 0-77-1-103-1-27-5-45-11-61-6.2-17-15-31-29-45s-28-22-45-29c-16-6-34-10-61-12-28-1-36-1-105-1zm0 45.4c67.2 0 75.2.2 101.7 1.4 24.6 1 38 5.2 46.8 8.7 11.8 4.6 20 10 29 18.8 8.8 9 14.2 17.2 18.8 29 3.5 9 7.6 22.2 8.7 46.8 1.2 26.5 1.4 34.5 1.4 101.8s-.2 76-1.4 102c-1 25-5.2 38-8.7 47-4.6 12-10 20-18.8 29-9 9-17.2 14-29 19-9 4-22.2 8-46.8 9-26.5 2-34.5 2-101.8 2s-76 0-102-1c-25-1-38-5-47-8.3-12-5-20-10-29-19s-14-17-19-29c-4-9-8-22.3-9-47-2-26.6-2-34.6-2-102 0-67 0-75 1-101.6 1-25 5-38 8.3-47 5-12 10-20 19-29 9.5-9 18-14.6 29.5-19 9-3.6 22.3-7.7 47-9 27-1.4 35-2 102-2z"/>
                  <path fill="currentColor" d="M252 336c-46.5 0-84-37.5-84-84 0-46.3 37.5-84 84-84 46.3 0 84 37.7 84 84 0 46.5-37.7 84-84 84zm0-213.3c-71.5 0-129.4 58-129.4 129.4 0 72 58 130 129.3 130 71 0 129-58 129-129 0-72-58-130-130-130zm164.6-5c0 16.6-13.5 30-30.2 30s-30.2-13.4-30.2-30 13.5-30.3 30.2-30.3 30.2 13.5 30.2 30.2"/>
                </g>
              </svg>

              <a class="Instagram-heading" href="${link}" target="_blank" rel="noopener noreferrer">${linkText}</a>

              <div class="Instagram-container">
                ${photos ? photos.map(photo => {
                  return html`
                    <a href="${photo.url}" class="Instagram-photo" rel="noopener noreferrer" target="_blank">
                      <figure class="Instagram-figure">
                        <img class="Instagram-img" width="200" height="200" src="${photo.imageSrc}" />
                      </figure>
                    </a>
                  `
                }) : [1, 2, 3, 4, 5, 6, 7, 8, 9].map(() => {
                  return html`
                    <div class="Instagram-photo"><div class="Instagram-figure"></div></div>
                  `
                })}
              </div>
            </div>
          </div>

          <a class="Card-link" href="${link}" target="_blank" rel="noopener noreferrer">
            <span class="Card-linkText">${__('More on Instagram')} <div class="Card-arrow"></div></span>
          </a>
        </div>
      </article>
    `
  }
})
