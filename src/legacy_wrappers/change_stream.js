'use strict';

const { toLegacy, maybeCallback } = require('../utils');

module.exports = Object.create(null);
Object.defineProperty(module.exports, '__esModule', { value: true });

module.exports.makeLegacyChangeStream = function (baseClass) {
  class LegacyChangeStream extends baseClass {
    close(options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
            ? options
            : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.close(options), callback);
    }
    hasNext(callback) {
      return maybeCallback(super.hasNext(), callback);
    }
    next(callback) {
      return maybeCallback(super.next(), callback);
    }
    tryNext(callback) {
      return maybeCallback(super.tryNext(), callback);
    }
  }

  Object.defineProperty(baseClass.prototype, toLegacy, {
    enumerable: false,
    value: function () {
      return Object.setPrototypeOf(this, LegacyChangeStream.prototype);
    }
  });

  return LegacyChangeStream;
};
