module.exports = function () {
  return function (state, emitter) {
    emitter.on('transitions:start', transition => {
      state.transitions.push(transition);
      emitter.emit(state.events.RENDER);
    });

    emitter.on('transitions:end', transition => {
      state.transitions = state.transitions.filter(name => name !== transition);
      emitter.emit(state.events.RENDER);
    });

    emitter.on(state.events.NAVIGATE, () => {
      state.transitions = [];
    });
  };
};
