const Prismic = require('prismic-javascript');
const { __ } = require('../../locale');

module.exports = function () {
  return function (state, emitter) {

    emitter.on('app:reset', () => {
      state.pages.items = [];
    });

    emitter.on('pages:fetch', data => {
      state.pages.isLoading = true;

      /**
       * Query the Prismic API
       */

      Prismic.api(process.env.PRISMIC_API).then(api => {
        let query;
        if (data.uid) {
          query = api.getByUID(data.type, data.uid, { ref: state.ref });
        } else if (data.single) {
          query = api.getSingle(data.single, { ref: state.ref });
        } else {
          throw notFound();
        }

        return query.then(doc => {
          if (!doc) { throw notFound(); }
          state.pages.isLoading = false;
          state.pages.items = state.pages.items.concat(doc);
          emitter.emit(state.events.RENDER);
        });
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
