'use strict';

const mongodbLegacy = require('..');

const OVERRIDDEN_CLASSES = [
  'Admin',
  'FindCursor',
  'ListCollectionsCursor',
  'ListIndexesCursor',
  'AggregationCursor',
  'ChangeStream',
  'Collection',
  'Db',
  'GridFSBucket',
  'MongoClient'
];

const METHODS_MODIFY_PROMISE = new Set([
  'Collection.rename',
  'Db.createCollection',
  'Db.collections',
  'MongoClient.connect'
]);

const OVERRIDDEN_CLASSES_TO_CB_METHODS = new Map(
  OVERRIDDEN_CLASSES.map(clsName => [
    clsName,
    Object.getOwnPropertyNames(mongodbLegacy[clsName].prototype)
      .filter(propName => propName !== 'constructor')
      .filter(propName =>
        mongodbLegacy[clsName].prototype[propName].toString().includes('callback) {')
      )
      .filter(propName => !METHODS_MODIFY_PROMISE.has(`${clsName}.${propName}`))
  ])
);

// eslint-disable-next-line no-console
console.dir(Object.fromEntries(OVERRIDDEN_CLASSES_TO_CB_METHODS.entries()));
