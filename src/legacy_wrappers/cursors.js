'use strict';

const { maybeCallback } = require('../utils');
const { toLegacy } = require('../utils');

module.exports = Object.create(null);
Object.defineProperty(module.exports, '__esModule', { value: true });

const commonCursorFunctions = new Map([
  [
    'close',
    function close(options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(
        Object.getPrototypeOf(this.constructor.prototype).close.call(this, options),
        callback
      );
    }
  ],

  [
    'forEach',
    function forEach(iterator, callback) {
      return maybeCallback(
        Object.getPrototypeOf(this.constructor.prototype).forEach.call(this, iterator),
        callback
      );
    }
  ],

  [
    'hasNext',
    function hasNext(callback) {
      return maybeCallback(
        Object.getPrototypeOf(this.constructor.prototype).hasNext.call(this),
        callback
      );
    }
  ],

  [
    'next',
    function next(callback) {
      return maybeCallback(
        Object.getPrototypeOf(this.constructor.prototype).next.call(this),
        callback
      );
    }
  ],

  [
    'toArray',
    function toArray(callback) {
      return maybeCallback(
        Object.getPrototypeOf(this.constructor.prototype).toArray.call(this),
        callback
      );
    }
  ],

  [
    'tryNext',
    function tryNext(callback) {
      return maybeCallback(
        Object.getPrototypeOf(this.constructor.prototype).tryNext.call(this),
        callback
      );
    }
  ]
]);

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
  }

  for (const [name, method] of commonCursorFunctions) {
    Object.defineProperty(LegacyFindCursor.prototype, name, { enumerable: false, value: method });
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
  class LegacyListCollectionsCursor extends baseClass {}

  for (const [name, method] of commonCursorFunctions) {
    Object.defineProperty(LegacyListCollectionsCursor.prototype, name, {
      enumerable: false,
      value: method
    });
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
  class LegacyListIndexesCursor extends baseClass {}

  for (const [name, method] of commonCursorFunctions) {
    Object.defineProperty(LegacyListIndexesCursor.prototype, name, {
      enumerable: false,
      value: method
    });
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
  }

  for (const [name, method] of commonCursorFunctions) {
    Object.defineProperty(LegacyAggregationCursor.prototype, name, {
      enumerable: false,
      value: method
    });
  }

  Object.defineProperty(baseClass.prototype, toLegacy, {
    enumerable: false,
    value: function () {
      return Object.setPrototypeOf(this, LegacyAggregationCursor.prototype);
    }
  });

  return LegacyAggregationCursor;
};
