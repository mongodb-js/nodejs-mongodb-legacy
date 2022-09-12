'use strict';

const { toLegacy, maybeCallback } = require('../utils');

const { version } = require('../../package.json');

module.exports = Object.create(null);
Object.defineProperty(module.exports, '__esModule', { value: true });

module.exports.makeLegacyMongoClient = function (baseClass) {
  class LegacyMongoClient extends baseClass {
    // constructor adds client metadata before constructing final client
    constructor(connectionString, options) {
      if (options == null) {
        options = {};
      }

      const incorrectOptionsType = typeof options !== 'object';
      const incorrectDriverInfo =
        options.driverInfo != null && typeof options.driverInfo !== 'object';
      if (incorrectOptionsType || incorrectDriverInfo) {
        // Pass this mistake along to the MongoClient constructor
        super(connectionString, options);
        return;
      }

      options = {
        ...options,
        driverInfo: options.driverInfo == null ? {} : { ...options.driverInfo }
      };

      const infoParts = {
        name: ['mongodb-legacy'],
        version: [version]
      };

      // name handling
      if (typeof options.driverInfo.name === 'string') {
        infoParts.name.push(options.driverInfo.name);
      }
      options.driverInfo.name = infoParts.name.join('|');

      // version handling
      if (typeof options.driverInfo.version === 'string') {
        infoParts.version.push(options.driverInfo.version);
      }
      options.driverInfo.version = infoParts.version.join('|');

      super(connectionString, options);
    }

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
