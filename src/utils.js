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
  if (options.driverInfo != null && typeof options.driverInfo !== 'object') {
    return;
  }

  options.driverInfo = options.driverInfo == null ? {} : options.driverInfo;

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
};
