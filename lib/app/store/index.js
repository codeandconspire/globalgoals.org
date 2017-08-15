const error = require('./error');
const goals = require('./goals');
const initiatives = require('./initiatives');

module.exports = function (initialState = {}) {
  return function (state, emitter) {
    Object.assign(state, initialState);

    [
      error(),
      goals(),
      initiatives()
    ].forEach(model => model(state, emitter));
  };
};
