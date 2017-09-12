/* globals ga */

module.exports = function () {
  return function (state, emitter) {
    if (process.env.GOOGLE_ANALYTICS_ID) {
      emitter.on(state.events.NAVIGATE, () => {
        ga('send', 'pageview', window.location.pathname);
      });

      emitter.on('error', err => {
        ga('send', 'exception', { exDescription: err.message, exFatal: true });
      });
    }
  };
};
