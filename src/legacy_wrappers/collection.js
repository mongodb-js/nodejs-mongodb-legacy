'use strict';

const { toLegacy, maybeCallback } = require('../utils');

module.exports = Object.create(null);
Object.defineProperty(module.exports, '__esModule', { value: true });

module.exports.makeLegacyCollection = function (baseClass) {
  class LegacyCollection extends baseClass {
    // async APIs
    bulkWrite(operations, options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.bulkWrite(operations, options), callback);
    }

    count(filter, options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : typeof filter === 'function'
          ? filter
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      filter = typeof filter !== 'function' ? filter : undefined;
      return maybeCallback(super.count(filter, options), callback);
    }

    countDocuments(filter, options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : typeof filter === 'function'
          ? filter
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      filter = typeof filter !== 'function' ? filter : undefined;
      return maybeCallback(super.countDocuments(filter, options), callback);
    }

    estimatedDocumentCount(options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.estimatedDocumentCount(options), callback);
    }

    createIndex(indexSpec, options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.createIndex(indexSpec, options), callback);
    }

    createIndexes(indexSpecs, options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.createIndexes(indexSpecs, options), callback);
    }

    dropIndex(indexName, options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.dropIndex(indexName, options), callback);
    }

    dropIndexes(options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.dropIndexes(options), callback);
    }

    deleteMany(filter, options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : typeof filter === 'function'
          ? filter
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      filter = typeof filter !== 'function' ? filter : undefined;
      return maybeCallback(super.deleteMany(filter, options), callback);
    }

    deleteOne(filter, options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : typeof filter === 'function'
          ? filter
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      filter = typeof filter !== 'function' ? filter : undefined;
      return maybeCallback(super.deleteOne(filter, options), callback);
    }

    distinct(key, filter, options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : typeof filter === 'function'
          ? filter
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      filter = typeof filter !== 'function' ? filter : undefined;
      return maybeCallback(super.distinct(key, filter, options), callback);
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

    findOne(filter, options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : typeof filter === 'function'
          ? filter
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      filter = typeof filter !== 'function' ? filter : undefined;
      return maybeCallback(super.findOne(filter, options), callback);
    }

    findOneAndDelete(filter, options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : typeof filter === 'function'
          ? filter
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      filter = typeof filter !== 'function' ? filter : undefined;
      return maybeCallback(super.findOneAndDelete(filter, options), callback);
    }

    findOneAndReplace(filter, replacement, options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.findOneAndReplace(filter, replacement, options), callback);
    }

    findOneAndUpdate(filter, update, options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.findOneAndUpdate(filter, update, options), callback);
    }

    indexExists(indexes, options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.indexExists(indexes, options), callback);
    }

    indexInformation(options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.indexInformation(options), callback);
    }

    indexes(options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.indexes(options), callback);
    }

    insertMany(docs, options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.insertMany(docs, options), callback);
    }

    insertOne(doc, options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.insertOne(doc, options), callback);
    }

    isCapped(options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.isCapped(options), callback);
    }

    options(options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.options(options), callback);
    }

    rename(newName, options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(
        super.rename(newName, options).then(collection => collection[toLegacy]()),
        callback
      );
    }

    replaceOne(filter, replacement, options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.replaceOne(filter, replacement, options), callback);
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

    updateMany(filter, update, options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.updateMany(filter, update, options), callback);
    }

    updateOne(filter, update, options, callback) {
      callback =
        typeof callback === 'function'
          ? callback
          : typeof options === 'function'
          ? options
          : undefined;
      options = typeof options !== 'function' ? options : undefined;
      return maybeCallback(super.updateOne(filter, update, options), callback);
    }

    // conversion APIs
    aggregate(pipeline, options) {
      return super.aggregate(pipeline, options)[toLegacy]();
    }

    initializeUnorderedBulkOp(options) {
      return super.initializeUnorderedBulkOp(options)[toLegacy]();
    }

    initializeOrderedBulkOp(options) {
      return super.initializeOrderedBulkOp(options)[toLegacy]();
    }

    find(filter, options) {
      return super.find(filter, options)[toLegacy]();
    }

    listIndexes(options) {
      return super.listIndexes(options)[toLegacy]();
    }

    watch(pipeline, options) {
      return super.watch(pipeline, options)[toLegacy]();
    }
  }

  Object.defineProperty(baseClass.prototype, toLegacy, {
    enumerable: false,
    value: function () {
      return Object.setPrototypeOf(this, LegacyCollection.prototype);
    }
  });

  return LegacyCollection;
};
