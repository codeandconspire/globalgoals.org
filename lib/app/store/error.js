module.exports = function () {
  return function error(state, emitter) {

    /**
     * Reset error message when navigating
     */

    emitter.prependListener(state.events.NAVIGATE, () => {
      state.error = null;
    });

    emitter.on('error', err => {
      state.error = err.message ? err : new Error(err);
      emitter.emit(state.events.RENDER);
    });
  };
};
