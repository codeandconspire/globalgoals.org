module.exports = function (initialState = {}) {
  return function (state, emitter) {
    Object.assign(state, initialState);
  };
};
