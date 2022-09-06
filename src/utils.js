'use strict';

const { version } = require('../package.json');

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

module.exports.addLegacyMetadata = options => {
  if (options.driverInfo == null) {
    options.driverInfo = {
      name: 'mongodb-legacy',
      version
    };
  } else {
    if (typeof options.driverInfo.name === 'string') {
      options.driverInfo.name = `mongodb-legacy|${options.driverInfo.name}`;
    } else {
      options.driverInfo.name = 'mongodb-legacy';
    }
    if (typeof options.driverInfo.version === 'string') {
      options.driverInfo.version = `${version}|${options.driverInfo.version}`;
    } else {
      options.driverInfo.version = version;
    }
  }
};
