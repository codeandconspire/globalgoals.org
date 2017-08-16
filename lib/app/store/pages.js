const Prismic = require('prismic-javascript');
const { __ } = require('../../locale');

const API = Prismic.api(process.env.PRISMIC_API);

module.exports = function () {
  return function (state, emitter) {
    emitter.on('pages:fetch', uid => {
      state.isLoading = true;

      /**
       * Query the Prismic API
       */

      API.then(api => api.getByUID('page', uid).then(doc => {
        if (!doc) {
          const err = new Error(__('Page not found'));
          err.status = 404;
          throw err;
        }

        state.pages.items = state.pages.items.concat(doc);
        state.isLoading = false;
        emitter.emit(state.events.RENDER);
      }).catch(err => {
        state.isLoading = false;
        emitter.emit('error', err);
      }));
    });
  };
};
