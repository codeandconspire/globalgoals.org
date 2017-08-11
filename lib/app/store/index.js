const error = require('./error');

module.exports = function (initialState = {}) {
  return function (state, emitter) {
    Object.assign(state, initialState);

    [
      error()
    ].forEach(model => model(state, emitter));
  };
};
