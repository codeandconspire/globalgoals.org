const Prismic = require('prismic-javascript');

const API = Prismic.api(process.env.PRISMIC_API);

module.exports = function () {
  return function (state, emitter) {

    /**
     * Fetch specific or all goals
     */

    emitter.on('goals:fetch', number => {
      let predicate, target;

      state.isLoading = true;

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

      API.then(api => api.query(
        predicate,
        { orderings: '[my.goal.number]' }
      )).then(response => {
        state.isLoading = false;

        /**
         * CHeck that we got all we were expecting
         */

        if (response.results_size !== target) {
          emitter.emit('error', new Error('Could not find all goals'));
        } else {
          state.goals.items = state.goals.items.concat(response.results);

          if (!state.transitions.include('takeover')) {
            emitter.emit(state.events.RENDER);
          }
        }
      }, err => {
        state.isLoading = false;
        emitter.emit('error', err);
      });
    });
  };
};
