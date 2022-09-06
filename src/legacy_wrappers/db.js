'use strict';

const { toLegacy, maybeCallback } = require('../utils');

module.exports = Object.create(null);
Object.defineProperty(module.exports, '__esModule', { value: true });

module.exports.makeLegacyDb = function (baseClass) {
  class LegacyDb extends baseClass {
    command(command, options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.command(command, options), callback);
    }

    // Async APIs
    addUser(username, password, options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : typeof password === 'function'
          ? password
          : undefined;
      options =
        options != null && typeof options === 'object'
          ? options
          : password != null && typeof password === 'object'
          ? password
          : undefined;
      password = typeof password === 'string' ? password : undefined;
      return maybeCallback(super.addUser(username, password, options), callback);
    }

    removeUser(username, options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.removeUser(username, options), callback);
    }

    createCollection(name, options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(
        super.createCollection(name, options).then(collection => collection[toLegacy]()),
        callback
      );
    }

    dropCollection(name, options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.dropCollection(name, options), callback);
    }

    createIndex(name, indexSpec, options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.createIndex(name, indexSpec, options), callback);
    }

    dropDatabase(options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.dropDatabase(options), callback);
    }

    indexInformation(name, options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.indexInformation(name, options), callback);
    }

    profilingLevel(options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.profilingLevel(options), callback);
    }

    setProfilingLevel(level, options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.setProfilingLevel(level, options), callback);
    }

    renameCollection(from, to, options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(
        super.renameCollection(from, to, options).then(collection => collection[toLegacy]()),
        callback
      );
    }

    stats(options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.stats(options), callback);
    }

    // Convert Result to legacy
    collections(options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(
        super
          .collections(options)
          .then(collections => collections.map(collection => collection[toLegacy]())),
        callback
      );
    }
    collection(name, options) {
      return super.collection(name, options)[toLegacy]();
    }
    admin() {
      return super.admin()[toLegacy]();
    }
    aggregate(pipeline, options) {
      return super.aggregate(pipeline, options)[toLegacy]();
    }
    listCollections(filter, options) {
      return super.listCollections(filter, options)[toLegacy]();
    }
    watch(pipeline, options) {
      return super.watch(pipeline, options)[toLegacy]();
    }
  }

  Object.defineProperty(baseClass.prototype, toLegacy, {
    enumerable: false,
    value: function () {
      return Object.setPrototypeOf(this, LegacyDb.prototype);
    }
  });

  return LegacyDb;
};
