'use strict';

module.exports = Object.create(null);
Object.defineProperty(module.exports, '__esModule', { value: true });

module.exports.toLegacy = Symbol.for('@@mdb.callbacks.toLegacy');

/**
 *
 * @template T
 * @param {Promise<T>} promise - promise intended for optional wrapping in callback style invocation
 * @param {(error?: Error, result?: T) => void} [callback] - optional callback argument to handle in case the API was invoked with a callback
 * @returns {Promise<T> | void}
 */
module.exports.maybeCallback = (promise, callback) => {
  if (callback != null) {
    promise.then(
      result => callback(undefined, result),
      error => callback(error)
    );
    return;
  }

  return promise;
};
