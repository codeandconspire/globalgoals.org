const { __ } = require('../../locale');

module.exports = function (getApi) {
  return function (state, emitter) {

    emitter.on('app:reset', () => {
      state.pages.items = [];
    });

    emitter.on('pages:fetch', data => {
      state.pages.isLoading = true;

      /**
       * Query the Prismic API
       */

      getApi().then(api => {
        let query;
        if (data.uid) {
          query = api.getByUID(data.type, data.uid);
        } else if (data.single) {
          query = api.getSingle(data.single);
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
