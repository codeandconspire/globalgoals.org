const Prismic = require('prismic-javascript');

const API = Prismic.api(process.env.PRISMIC_API);

module.exports = function () {
  return function (state, emitter) {
    emitter.on('pages:fetch', uid => {
      state.pages.isLoading = true;

      /**
       * Query the Prismic API
       */

      API.then(api => api.getByUID('page', uid).then(doc => {
        state.pages.items = state.pages.items.concat(doc);
        state.pages.isLoading = false;
        emitter.emit(state.events.RENDER);
      }, err => {
        state.pages.isLoading = false;
        emitter.emit('error', err);
      }));
    });
  };
};
