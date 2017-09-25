module.exports = function () {
  return function (state, emitter) {
    state.ui = Object.assign({}, state.ui, {
      isSharing: false,
      navigationOpen: false,
      headerOffset: 0
    });

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

    emitter.on('ui:share:toggle', (toggle = !state.ui.isSharing) => {
      state.ui.isSharing = toggle;
      emitter.emit(state.events.RENDER);
    });
  };
};
