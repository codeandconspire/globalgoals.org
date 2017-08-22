const Prismic = require('prismic-javascript');

const API = Prismic.api(process.env.PRISMIC_API);
const PAGE_SIZE = 6;

module.exports = function () {
  return function (state, emitter) {
    emitter.on('articles:fetch', uid => {
      let predicate;

      state.articles.isLoading = true;

      /**
       * Figure out the query
       */

      if (uid) {
        predicate = Prismic.Predicates.at('my.news.uid', uid);
      } else {
        predicate = Prismic.Predicates.at('document.type', 'news');
      }

      /**
       * Query the Prismic API
       */

      API.then(api => api.query(predicate, {
        pageSize: PAGE_SIZE,
        page: Math.floor(state.articles.items.length / PAGE_SIZE)
      })).then(response => {

        /**
         * Identify which articles we did not already have
         */

        const newcomers = response.results.filter(result => {
          const exists = state.articles.items.find(doc => doc.uid === result.uid);
          return !exists;
        });
        const items = state.articles.items.concat(newcomers);

        state.articles.isLoading = false;
        state.articles.items = items;
        emitter.emit(state.events.RENDER);
      }, err => {
        state.articles.isLoading = false;
        emitter.emit('error', err);
      });
    });
  };
};
