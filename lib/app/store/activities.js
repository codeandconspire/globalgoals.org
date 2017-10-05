const Prismic = require('prismic-javascript');

module.exports = function (getApi) {
  return function (state, emitter) {

    emitter.on('app:reset', () => {
      state.activities.items = [];
    });

    emitter.on('activities:fetch', uid => {
      let predicate, target;

      state.activities.isLoading = true;

      /**
       * Figure out the query and how many items we are expecting to get
       */

      if (uid) {
        target = 1;
        predicate = Prismic.Predicates.at('my.activity.uid', uid);
      } else {
        target = state.activities.total;
        predicate = Prismic.Predicates.at('document.type', 'activity');
      }

      /**
       * Query the Prismic API
       */

      getApi().then(api => api.query(predicate)).then(response => {
        /**
         * Check that we got all we were expecting
         */

        if (response.results_size !== target) {
          throw new Error('Could not find all activities');
        }


        if (uid) {
          const items = state.activities.items.concat(response.results);
          state.activities.items = items;
        } else {
          state.activities.items = response.results;
        }

        state.activities.isLoading = false;
        emitter.emit(state.events.RENDER);
      }).catch(err => {
        state.activities.isLoading = false;
        emitter.emit('error', err);
      });
    });
  };
};
