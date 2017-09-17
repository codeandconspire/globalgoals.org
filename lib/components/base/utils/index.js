exports.className = function className(root, classes) {
  if (typeof root === 'object') {
    classes = root;
    root = '';
  }

  return Object.entries(classes)
    .filter(([key, value]) => !!value)
    .reduce((str, [next]) => str + ' ' + next, root)
    .trim();
};
