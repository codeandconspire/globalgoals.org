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
        target = state.goals.length;
        predicate = Prismic.Predicates.at('document.type', 'goal');
      }

      API.then(api => api.query(
        predicate,
        { orderings: '[my.goal.number]' }
      )).then(response => {
        state.isLoading = false;

        if (response.results.length !== target) {
          emitter.emit('error', new Error('Could not find all goals'));
        } else {
          response.results.forEach(goal => {
            state.goals[goal.data.number - 1] = goal;
          });
          emitter.emit(state.events.RENDER);
        }
      }, err => {
        state.isLoading = false;
        emitter.emit('error', err);
      });
    });
  };
};
