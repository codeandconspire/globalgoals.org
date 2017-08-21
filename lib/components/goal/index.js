const icons = require('./icons');

exports.icon = ({ goal = 1, inverted = false, fill = false, cover = false } = {}) => {
  return icons(goal)({ inverted, fill, cover });
};

exports.color = (goal) => {
  const arr = [
    '#e5243b',
    '#dda63a',
    '#4c9f38',
    '#c5192d',
    '#ff3a21',
    '#26bde2',
    '#fcc30b',
    '#a21942',
    '#fd6925',
    '#dd1367',
    '#fd9d24',
    '#bf8b2e',
    '#3f7e44',
    '#0a97d9',
    '#56c02b',
    '#00689d',
    '#19486a'
  ]

  return arr[goal - 1];
};
