'use strict';

const { maybeCallback, toLegacy } = require('../utils');

module.exports = Object.create(null);
Object.defineProperty(module.exports, '__esModule', { value: true });

module.exports.makeLegacyOrderedBulkOperation = function (baseClass) {
  class LegacyOrderedBulkOperation extends baseClass {
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
  }

  Object.defineProperty(baseClass.prototype, toLegacy, {
    enumerable: false,
    value: function () {
      return Object.setPrototypeOf(this, LegacyOrderedBulkOperation.prototype);
    }
  });

  return LegacyOrderedBulkOperation;
};

module.exports.makeLegacyUnorderedBulkOperation = function (baseClass) {
  class LegacyUnorderedBulkOperation extends baseClass {
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
  }

  Object.defineProperty(baseClass.prototype, toLegacy, {
    enumerable: false,
    value: function () {
      return Object.setPrototypeOf(this, LegacyUnorderedBulkOperation.prototype);
    }
  });

  return LegacyUnorderedBulkOperation;
};
