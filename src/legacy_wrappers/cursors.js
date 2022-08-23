'use strict';

const { maybeCallback } = require('../utils');
const { toLegacy } = require('../utils');

module.exports = Object.create(null);
Object.defineProperty(module.exports, '__esModule', { value: true });

module.exports.makeLegacyFindCursor = function (baseClass) {
  class LegacyFindCursor extends baseClass {
    /** @deprecated Use `collection.estimatedDocumentCount` or `collection.countDocuments` instead */
    count(options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.count(options), callback);
    }

    explain(verbosity, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof verbosity === 'function'
          ? verbosity
          : undefined;
      verbosity = typeof verbosity !== 'function' ? verbosity : undefined;
      return maybeCallback(super.explain(verbosity), callback);
    }

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
    forEach(iterator, callback) {
      return maybeCallback(super.forEach(iterator), callback);
    }
    hasNext(callback) {
      return maybeCallback(super.hasNext(), callback);
    }
    next(callback) {
      return maybeCallback(super.next(), callback);
    }
    toArray(callback) {
      return maybeCallback(super.toArray(), callback);
    }
    tryNext(callback) {
      return maybeCallback(super.tryNext(), callback);
    }
  }

  Object.defineProperty(baseClass.prototype, toLegacy, {
    enumerable: false,
    value: function () {
      return Object.setPrototypeOf(this, LegacyFindCursor.prototype);
    }
  });

  return LegacyFindCursor;
};

module.exports.makeLegacyListCollectionsCursor = function (baseClass) {
  class LegacyListCollectionsCursor extends baseClass {
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
    forEach(iterator, callback) {
      return maybeCallback(super.forEach(iterator), callback);
    }
    hasNext(callback) {
      return maybeCallback(super.hasNext(), callback);
    }
    next(callback) {
      return maybeCallback(super.next(), callback);
    }
    toArray(callback) {
      return maybeCallback(super.toArray(), callback);
    }
    tryNext(callback) {
      return maybeCallback(super.tryNext(), callback);
    }
  }

  Object.defineProperty(baseClass.prototype, toLegacy, {
    enumerable: false,
    value: function () {
      return Object.setPrototypeOf(this, LegacyListCollectionsCursor.prototype);
    }
  });

  return LegacyListCollectionsCursor;
};

module.exports.makeLegacyListIndexesCursor = function (baseClass) {
  class LegacyListIndexesCursor extends baseClass {
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
    forEach(iterator, callback) {
      return maybeCallback(super.forEach(iterator), callback);
    }
    hasNext(callback) {
      return maybeCallback(super.hasNext(), callback);
    }
    next(callback) {
      return maybeCallback(super.next(), callback);
    }
    toArray(callback) {
      return maybeCallback(super.toArray(), callback);
    }
    tryNext(callback) {
      return maybeCallback(super.tryNext(), callback);
    }
  }

  Object.defineProperty(baseClass.prototype, toLegacy, {
    enumerable: false,
    value: function () {
      return Object.setPrototypeOf(this, LegacyListIndexesCursor.prototype);
    }
  });

  return LegacyListIndexesCursor;
};

module.exports.makeLegacyAggregationCursor = function (baseClass) {
  class LegacyAggregationCursor extends baseClass {
    explain(verbosity, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof verbosity === 'function'
          ? verbosity
          : undefined;
      verbosity = typeof verbosity !== 'function' ? verbosity : undefined;
      return maybeCallback(super.explain(verbosity), callback);
    }

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
    forEach(iterator, callback) {
      return maybeCallback(super.forEach(iterator), callback);
    }
    hasNext(callback) {
      return maybeCallback(super.hasNext(), callback);
    }
    next(callback) {
      return maybeCallback(super.next(), callback);
    }
    toArray(callback) {
      return maybeCallback(super.toArray(), callback);
    }
    tryNext(callback) {
      return maybeCallback(super.tryNext(), callback);
    }
  }

  Object.defineProperty(baseClass.prototype, toLegacy, {
    enumerable: false,
    value: function () {
      return Object.setPrototypeOf(this, LegacyAggregationCursor.prototype);
    }
  });

  return LegacyAggregationCursor;
};
