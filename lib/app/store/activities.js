const Prismic = require('prismic-javascript');
const { __ } = require('../../locale');

module.exports = function () {
  return function (state, emitter) {

    emitter.on('app:reset', () => {
      state.activities.items = [];
    });

    emitter.on('activities:fetch', data => {
      state.activities.isLoading = true;

      /**
       * Figure out the query and how many items we are expecting to get
       */

      Prismic.api(process.env.PRISMIC_API).then(api => {
        let query;

        if (!data) {
          // Get all activities
          query = api.query(Prismic.Predicates.at('document.type', 'activity'), {
            ref: state.ref
          });
        } else if (data.uid) {
          // Get activity by uid
          query = api.query(Prismic.Predicates.at('my.activity.uid', data.uid), {
            ref: state.ref
          });
        } else if (data.tags) {
          // Cache that these tags have been fetched
          state.activities.fetched.push(...data.tags);

          // Get all activities with matching tags
          query = api.query([
            Prismic.Predicates.at('document.type', 'activity'),
            Prismic.Predicates.at('document.tags', data.tags)
          ], { ref: state.ref });
        } else {
          const err = new Error(__('Page not found'));
          err.status = 404;
          throw err;
        }

        /**
         * Query the Prismic API
         */

        query.then(response => {
          const newcomers = response.results.filter(result => {
            return !state.activities.items.find(doc => doc.id === result.id);
          });

          state.activities.isLoading = false;
          state.activities.items = state.activities.items.concat(newcomers)
          emitter.emit(state.events.RENDER);
        }).catch(err => {
          state.activities.isLoading = false;
          emitter.emit('error', { status: 503, error: err });
        });
      });
    });
  };
};
