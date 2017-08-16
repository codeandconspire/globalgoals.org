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
          // TODO: Use `Prismic.Predicate` once prismic resolves https://github.com/prismicio/prismic-javascript/pull/16
          // predicate = Prismic.Predicates.any('my.goal.number', number);
          predicate = `[:d = any(my.goal.number, [${ number.join(',') }])]`;
        } else {
          target = 1;
          // TODO: Use `Prismic.Predicate` once prismic resolves https://github.com/prismicio/prismic-javascript/pull/16
          // predicate = Prismic.Predicates.at('my.goal.number', number);
          predicate = `[:d = at(my.goal.number, ${ number })]`;
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
          emitter.emit(state.events.RENDER);
        }
      }, err => {
        state.isLoading = false;
        emitter.emit('error', err);
      });
    });
  };
};
