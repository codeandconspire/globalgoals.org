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

    emitter.on('transitions:pushstate', href => {
      state.prevScrollPosition = window.scrollY;
      emitter.once(state.events.RENDER, () => {
        window.scrollTo(0, 0);
      });
      emitter.emit(state.events.PUSHSTATE, href);
    });

    emitter.on('transitions:popstate', href => {
      const scrollY = state.prevScrollPosition;
      state.prevScrollPosition = null;
      emitter.once(state.events.RENDER, () => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo(0, scrollY);
          });
        });
      });
      emitter.emit(state.events.REPLACESTATE, href);
    });

    emitter.on(state.events.NAVIGATE, () => {
      state.transitions = [];
    });
  };
};
