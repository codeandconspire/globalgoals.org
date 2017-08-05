const REFERRER_PREFIX = /^ref-/;
const SLUG_PREFIX = /^-/;

module.exports = function (initialState = {}) {
  return function (state, emitter) {
    Object.assign(state, initialState);

    emitter.on(state.events.NAVIGATE, () => {
      const { params } = state;

      if (params.referrer) {
        params.referrer = params.referrer.replace(REFERRER_PREFIX, '');
      }

      if (params.slug) {
        params.slug = params.slug.replace(SLUG_PREFIX, '');
      }
    });
  };
};
