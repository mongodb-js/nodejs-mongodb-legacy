'use strict';

module.exports = Object.create(null);
Object.defineProperty(module.exports, '__esModule', { value: true });

/**
 * callback to pass to array sort
 */
module.exports.byStrings = (a, b) => {
  return String.prototype.localeCompare.call(`${a}`, `${b}`);
};
