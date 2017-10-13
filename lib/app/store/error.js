const { fromError } = require('../../components/base/utils');

module.exports = function () {
  return function error(state, emitter) {

    /**
     * Reset error message when navigating
     */

    emitter.prependListener(state.events.NAVIGATE, () => {
      state.error = null;
    });

    emitter.on('error', err => {
      let error = err;

      if (!(err instanceof Error)) {
        if (typeof err === 'string') {
          error = new Error(err);
        } else if (typeof err === 'object') {
          error = err.error || new Error('Unknown error');

          if (typeof error === 'string') {
            error = new Error(error);
          }

          error.status = err.status || 500;
        } else {
          error = new Error('Unknown error');
          error.status = 500;
        }
      }

      state.error = fromError(error);
      emitter.emit(state.events.RENDER);
    });
  };
};
