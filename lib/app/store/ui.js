module.exports = function () {
  return function (state, emitter) {
    emitter.on('ui:hero:height', height => {
      state.ui.headerOffset = height;
      emitter.emit(state.events.RENDER);
    });

    emitter.on('ui:navigation:toggle', (toggle = !state.ui.navigationOpen) => {
      state.ui.navigationOpen = toggle;
      emitter.emit(state.events.RENDER);
    });

    emitter.on(state.events.NAVIGATE, () => {
      state.ui.navigationOpen = false;
    });
  };
};
