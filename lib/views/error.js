const errors = require('../components/error')
const view = require('../components/view')
const { __ } = require('../locale')

module.exports = function createError (status) {
  return view(error, title)

  function error (state) {
    return errors[status.toString()](state.error)
  }

  function title (status) {
    switch (status) {
      case 404: return __('Not found')
      case 500: return __('An error occured')
      case 503: return __('You\'re offline')
      default: return null
    }
  }
}
