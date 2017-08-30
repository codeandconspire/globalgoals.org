const Prismic = require('prismic-javascript');
const { __ } = require('../../locale');

module.exports = function () {
  return function (state, emitter) {
    emitter.on('pages:fetch', async data => {
      state.pages.isLoading = true;

      /**
       * Query the Prismic API
       */

      try {
        const api = await Prismic.api(process.env.PRISMIC_API);
        let doc;

        if (data.uid) {
          doc = await api.getByUID(data.type, data.uid);
        } else if (data.single) {
          doc = await api.getSingle(data.single);
        } else {
          throw notFound();
        }

        if (!doc) { throw notFound(); }

        state.pages.isLoading = false;
        state.pages.items = state.pages.items.concat(doc);
        emitter.emit(state.events.RENDER);
      } catch (err) {
        state.pages.isLoading = false;
        emitter.emit('error', err);
      }
    });
  };
};

function notFound() {
  const err = new Error(__('Page not found'));
  err.status = 404;
  return err;
}
