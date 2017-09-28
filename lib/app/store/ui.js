const { title, image, description } = require('../../components/meta');

module.exports = function () {
  return function (state, emitter) {
    state.ui = Object.assign({}, state.ui, {
      sharing: null,
      navigationOpen: false,
      headerOffset: 0,
      cta: {
        expanded: null,
        firstPick: null
      }
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

    emitter.on('ui:share:toggle', (toggle = !state.ui.sharing) => {
      let sharing = toggle;

      if (sharing === true) {
        sharing = {
          href: state.href,
          image: image(state),
          title: title(state),
          description: description(state)
        };
      }

      state.ui.sharing = sharing;
      emitter.emit(state.events.RENDER);
    });

    emitter.on('ui:cta:toggle', (id = null) => {
      state.ui.cta.firstPick = state.ui.cta.firstPick || id;
      state.ui.cta.expanded = id;
      emitter.emit(state.events.RENDER);
    });

    emitter.prependListener(state.events.NAVIGATE, () => {
      state.ui.cta.firstPick = null;
      state.ui.cta.expanded = null;
    });
  };
};
