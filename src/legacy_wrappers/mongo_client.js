'use strict';

const { toLegacy, maybeCallback } = require('../utils');

module.exports = Object.create(null);
Object.defineProperty(module.exports, '__esModule', { value: true });

module.exports.makeLegacyMongoClient = function (baseClass) {
  class LegacyMongoClient extends baseClass {
    static connect(url, options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(
        baseClass.connect(url, options).then(client => client[toLegacy]()),
        callback
      );
    }

    connect(callback) {
      return maybeCallback(
        super.connect().then(client => client[toLegacy]()),
        callback
      );
    }

    close(force, callback) {
      callback =
        typeof callback === 'function' ? callback : typeof force === 'function' ? force : undefined;
      force = typeof force !== 'function' ? force : undefined;
      return maybeCallback(super.close(force), callback);
    }

    // Convert to legacy versions of the following:
    db(dbName, options) {
      return super.db(dbName, options)[toLegacy]();
    }

    watch(pipeline, options) {
      return super.watch(pipeline, options)[toLegacy]();
    }

    startSession(options) {
      return super.startSession(options)[toLegacy]();
    }

    withSession(options, executeWithSession) {
      executeWithSession =
        typeof executeWithSession === 'function'
          ? executeWithSession
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return super.withSession(options, session => executeWithSession(session[toLegacy]()));
    }
  }

  Object.defineProperty(baseClass.prototype, toLegacy, {
    enumerable: false,
    value: function () {
      return Object.setPrototypeOf(this, LegacyMongoClient.prototype);
    }
  });

  return LegacyMongoClient;
};