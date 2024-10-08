'use strict';

const { toLegacy, maybeCallback } = require('../utils');

module.exports = Object.create(null);
Object.defineProperty(module.exports, '__esModule', { value: true });

module.exports.makeLegacyClientSession = function (baseClass) {
  class LegacyClientSession extends baseClass {
    abortTransaction(options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
            ? options
            : undefined;
      options = typeof options !== 'function' ? options : undefined;

      return maybeCallback(super.abortTransaction(options), callback);
    }

    commitTransaction(options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
            ? options
            : undefined;
      options = typeof options !== 'function' ? options : undefined;

      return maybeCallback(super.commitTransaction(options), callback);
    }

    endSession(options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
            ? options
            : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.endSession(options), callback);
    }

    withTransaction(executeWithTransaction, options) {
      return super.withTransaction(session => executeWithTransaction(session[toLegacy]()), options);
    }
  }

  Object.defineProperty(baseClass.prototype, toLegacy, {
    enumerable: false,
    value: function () {
      return Object.setPrototypeOf(this, LegacyClientSession.prototype);
    }
  });

  return LegacyClientSession;
};
