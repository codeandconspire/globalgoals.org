const error = require('./error');
const goals = require('./goals');
const initiatives = require('./initiatives');
const articles = require('./articles');

module.exports = function (initialState = {}) {
  return function (state, emitter) {
    Object.assign(state, initialState);

    [
      error(),
      goals(),
      initiatives(),
      articles()
    ].forEach(model => model(state, emitter));
  };
};
