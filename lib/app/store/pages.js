const Prismic = require('prismic-javascript');
const { __ } = require('../../locale');

const API = Prismic.api(process.env.PRISMIC_API);

module.exports = function () {
  return function (state, emitter) {
    emitter.on('pages:fetch', data => {
      state.pages.isLoading = true;

      /**
       * Query the Prismic API
       */

      API.then(api => {
        if (data.uid) {
          return api.getByUID(data.type, data.uid);
        } else if (data.single) {
          return api.getSingle(data.single);
        } else {
          throw notFound();
        }
      }).then(doc => {
        if (!doc) {
          throw notFound();
        }

        state.pages.isLoading = false;
        state.pages.items = state.pages.items.concat(doc);
        emitter.emit(state.events.RENDER);
      }).catch(err => {
        state.pages.isLoading = false;
        emitter.emit('error', err);
      });
    });
  };
};

function notFound() {
  const err = new Error(__('Page not found'));
  err.status = 404;
  return err;
}
