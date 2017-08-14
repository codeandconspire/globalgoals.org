const error = require('./error');
const goals = require('./goals');

module.exports = function (initialState = {}) {
  return function (state, emitter) {
    Object.assign(state, initialState);

    [
      error(),
      goals()
    ].forEach(model => model(state, emitter));
  };
};
