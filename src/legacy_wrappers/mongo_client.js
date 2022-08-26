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
      try {
        const client = new this(url, options);
        return client.connect(callback);
      } catch (error) {
        return maybeCallback(Promise.reject(error), callback);
      }
    }

    connect(callback) {
      return maybeCallback(
        super.connect().then(() => this),
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

  return LegacyMongoClient;
};
