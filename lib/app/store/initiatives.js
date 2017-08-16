const Prismic = require('prismic-javascript');

const API = Prismic.api(process.env.PRISMIC_API);

module.exports = function () {
  return function (state, emitter) {
    emitter.on('initiatives:fetch', uid => {
      let predicate, target;

      state.isLoading = true;

      /**
       * Figure out the query and how many items we are expecting to get
       */

      if (uid) {
        target = 1;
        predicate = Prismic.Predicates.at('my.initiative.uid', uid);
      } else {
        target = state.initiatives.total;
        predicate = Prismic.Predicates.at('document.type', 'initiative');
      }

      /**
       * Query the Prismic API
       */

      API.then(api => api.query(predicate)).then(response => {
        state.isLoading = false;

        /**
         * Check that we got all we were expecting
         */

        if (response.results_size !== target) {
          emitter.emit('error', new Error('Could not find all initiatives'));
        } else {
          if (uid) {
            const items = state.initiatives.items.concat(response.results);
            state.initiatives.items = items;
          } else {
            state.initiatives.items = response.results;
          }
          emitter.emit(state.events.RENDER);
        }
      }, err => {
        state.isLoading = false;
        emitter.emit('error', err);
      });
    });
  };
};
