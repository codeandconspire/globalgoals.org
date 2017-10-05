const Prismic = require('prismic-javascript');

module.exports = function (getApi) {
  return function (state, emitter) {

    emitter.on('app:reset', () => {
      state.articles.items = [];
    });

    emitter.on('articles:goto', goto => {
      const { items, total, pageSize, page } = state.articles;
      const max = Math.ceil(total / pageSize);
      const shouldHave = page === max ? total : page * pageSize;

      state.articles.page = goto;

      if (items !== shouldHave) {
        emitter.emit('articles:fetch');
      }
    });

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

      getApi().then(api => api.query(predicate, {
        pageSize: state.articles.pageSize,
        page: state.articles.page,
        orderings: '[my.news.original_publication_date desc, document.first_publication_date desc]'
      })).then(response => {
        /**
         * Identify which articles we did not already have
         */

        const newcomers = response.results.filter(result => {
          const exists = state.articles.items.find(doc => doc.id === result.id);
          return !exists;
        });
        const items = state.articles.items.concat(newcomers);

        state.articles.isLoading = false;
        state.articles.items = items;
        emitter.emit(state.events.RENDER);
      }).catch(err => {
        state.articles.isLoading = false;
        emitter.emit('error', err);
      });
    });
  };
};
