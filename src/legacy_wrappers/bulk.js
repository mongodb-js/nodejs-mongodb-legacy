'use strict';

const { maybeCallback } = require('../utils');

module.exports = Object.create(null);
Object.defineProperty(module.exports, '__esModule', { value: true });

module.exports.makeLegacyOrderedBulkOperation = function (baseClass) {
  return class LegacyOrderedBulkOperation extends baseClass {
    execute(options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.execute(options), callback);
    }
  };
};

module.exports.makeLegacyUnorderedBulkOperation = function (baseClass) {
  return class LegacyUnorderedBulkOperation extends baseClass {
    execute(options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.execute(options), callback);
    }
  };
};
