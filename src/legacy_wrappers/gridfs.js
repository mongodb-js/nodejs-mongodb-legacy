'use strict';

const { toLegacy, maybeCallback } = require('../utils');

module.exports = Object.create(null);
Object.defineProperty(module.exports, '__esModule', { value: true });

module.exports.makeLegacyGridFSBucket = function (baseClass) {
  class LegacyGridFSBucket extends baseClass {
    delete(id, options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
            ? options
            : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.delete(id, options), callback);
    }

    rename(id, filename, options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
            ? options
            : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.rename(id, filename, options), callback);
    }

    drop(options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
            ? options
            : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.drop(options), callback);
    }

    // conversion
    find(filter, options) {
      return super.find(filter, options)[toLegacy]();
    }

    openUploadStream(filename, options) {
      return super.openUploadStream(filename, options)[toLegacy]();
    }

    openUploadStreamWithId(id, filename, options) {
      return super.openUploadStreamWithId(id, filename, options)[toLegacy]();
    }
  }

  Object.defineProperty(baseClass.prototype, toLegacy, {
    enumerable: false,
    value: function () {
      return Object.setPrototypeOf(this, LegacyGridFSBucket.prototype);
    }
  });

  return LegacyGridFSBucket;
};

module.exports.makeLegacyGridFSBucketWriteStream = function (baseClass) {
  class LegacyGridFSBucketWriteStream extends baseClass {
    abort(callback) {
      return maybeCallback(super.abort(), callback);
    }
  }

  Object.defineProperty(baseClass.prototype, toLegacy, {
    enumerable: false,
    value: function () {
      return Object.setPrototypeOf(this, LegacyGridFSBucketWriteStream.prototype);
    }
  });

  return LegacyGridFSBucketWriteStream;
};
