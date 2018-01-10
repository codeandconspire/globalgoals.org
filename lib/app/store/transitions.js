module.exports = function () {
  return function (state, emitter) {
    emitter.on('transitions:start', transition => {
      state.transitions.push(transition)
    })

    emitter.on('transitions:end', transition => {
      state.transitions = state.transitions.filter(name => name !== transition)
    })

    emitter.on('transitions:pushstate', href => {
      state.transitions.push('pushstate')
      state.prevScrollPosition = window.pageYOffset || window.scollY || 0
      window.scrollTo(0, 0)
      window.requestAnimationFrame(function () {
        emitter.emit(state.events.PUSHSTATE, href)
      })
    })

    emitter.on('transitions:popstate', href => {
      const scrollY = state.prevScrollPosition
      state.prevScrollPosition = null
      state.transitions.push('popstate')
      emitter.once(state.events.RENDER, function () {
        window.scrollTo(0, scrollY)
      })
      emitter.emit(state.events.REPLACESTATE, href)
    })

    emitter.on(state.events.NAVIGATE, () => {
      state.transitions = []
    })
  }
}
