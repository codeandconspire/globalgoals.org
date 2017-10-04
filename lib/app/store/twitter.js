module.exports = function () {
  return function (state, emitter) {
    emitter.on('twitter:fetch', (hashtag = null) => {
      state.twitter.isLoading = true;
      emitter.emit(state.events.RENDER);

      let url = '/api/twitter';
      if (hashtag) {
        url += `?hashtag=${ encodeURIComponent(hashtag) }`;
      }

      fetch(url).then(response => {
        if (!response.ok) {
          state.twitter.isLoading = false;
          throw new Error(`Twitter rejected with ${ response.status }`);
        }

        return response.json().then(result => {
          state.twitter.isLoading = false;
          state.twitter.items[hashtag || url] = result.statuses;
          emitter.emit(state.events.RENDER);
        });
      }).catch(err => {
        state.twitter.isLoading = false;
        emitter.emit('error', err);
      });
    });
  };
};
