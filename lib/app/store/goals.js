const Prismic = require('prismic-javascript');

module.exports = function () {
  return function (state, emitter) {

    /**
     * Fetch specific or all goals
     */

    emitter.on('goals:fetch', number => {
      let predicate, target;

      state.goals.isLoading = true;

      /**
       * Figure out the query and how many items we hope to recieve
       */

      if (number) {
        if (Array.isArray(number)) {
          target = number.length;
          predicate = Prismic.Predicates.any('my.goal.number', number);
        } else {
          target = 1;
          predicate = Prismic.Predicates.at('my.goal.number', number);
        }
      } else {
        target = state.goals.total;
        predicate = Prismic.Predicates.at('document.type', 'goal');
      }

      /**
       * Query the Prismic API
       */

      Prismic.api(process.env.PRISMIC_API).then(api => api.query(predicate, {
        ref: state.ref,
        orderings: '[my.goal.number]'
      })).then(response => {

        /**
         * Check that we got all we were expecting
         */

        if (response.results_size !== target) {
          throw new Error('Could not find all goals');
        }

        state.goals.isLoading = false;
        state.goals.items = state.goals.items.concat(response.results);

        if (!state.transitions.includes('takeover')) {
          emitter.emit(state.events.RENDER);
        }
      }).catch(err => {
        state.goals.isLoading = false;
        emitter.emit('error', err);
      });
    });
  };
};
