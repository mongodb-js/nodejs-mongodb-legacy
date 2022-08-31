'use strict';

module.exports = Object.create(null);
Object.defineProperty(module.exports, '__esModule', { value: true });

/**
 * callback to pass to array sort
 */
module.exports.byStrings = (a, b) => {
  return `${a}`.localeCompare(`${b}`);
};

module.exports.sorted = (iterable, how) => {
  if (typeof how !== 'function') {
    throw new TypeError('must provide a "how" function to sorted');
  }
  const items = Array.from(iterable);
  items.sort(how);
  return items;
};
