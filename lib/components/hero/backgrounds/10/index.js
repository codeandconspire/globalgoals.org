const html = require('choo/html')
const component = require('fun-component')

module.exports = component({
  name: 'background-10',
  load (element) {
    const boards = element.querySelectorAll('.js-board')

    element.addEventListener('transitionend', function ontransitionend () {
      element.removeEventListener('transitionend', ontransitionend)

      for (let i = 0; i < boards.length; i += 1) {
        tilt(boards[i], i % 2 ? 'right' : 'left')
      }
    })

    element.classList.add('is-visible')
  },
  render () {
    return html`
      <div class="Hero-bg Hero10" id="hero-bg-10">
        <div class="Hero10-board Hero10-board--light js-board"></div>
        <div class="Hero10-board Hero10-board--dark js-board"></div>
        <div class="Hero10-bend"></div>
      </div>
    `
  }
})

function tilt (element, direction = 'right', again = true) {
  element.addEventListener('transitionend', function ontransitionend () {
    element.removeEventListener('transitionend', ontransitionend)
    window.setTimeout(() => {
      element.classList.remove(`is-${direction}Tilted`)
      if (again) {
        tilt(element, direction === 'right' ? 'left' : 'right', false)
      }
    }, 250)
  })

  element.classList.add(`is-${direction}Tilted`)
}
