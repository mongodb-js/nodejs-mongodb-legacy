/* eslint-disable prettier/prettier */
'use strict';

const { byStrings, sorted } = require('./utils');

module.exports = Object.create(null);
Object.defineProperty(module.exports, '__esModule', { value: true });

const commonCursorApis = [
  { className: 'AbstractCursor', method: 'close', returnType: 'Promise<void>' },
  { className: 'AbstractCursor', method: 'forEach', returnType: 'Promise<void>', possibleCallbackPositions: [1] },
  { className: 'AbstractCursor', method: 'hasNext', returnType: 'Promise<boolean>' },
  { className: 'AbstractCursor', method: 'next', returnType: 'Promise<TSchema | null>' },
  { className: 'AbstractCursor', method: 'toArray', returnType: 'Promise<TSchema[]>' },
  { className: 'AbstractCursor', method: 'tryNext', returnType: 'Promise<TSchema | null>' },
]
module.exports.commonCursorApis = commonCursorApis;

const cursorClasses = [
  'FindCursor',
  'AggregationCursor',
  'ListIndexesCursor',
  'ListCollectionsCursor'
]
module.exports.cursorClasses = cursorClasses;

const api = [
  // Super class of cursors, we do not directly override these but override them in the inherited classes
  ...commonCursorApis.flatMap(({ method, returnType, possibleCallbackPositions }) => cursorClasses.map(cursorClass => ({ className: cursorClass, method, returnType, possibleCallbackPositions }))),

  { className: 'Admin', method: 'buildInfo', returnType: 'Promise<Document>' },
  { className: 'Admin', method: 'command', returnType: 'Promise<Document>' },
  { className: 'Admin', method: 'listDatabases', returnType: 'Promise<ListDatabasesResult>' },
  { className: 'Admin', method: 'ping', returnType: 'Promise<Document>' },
  { className: 'Admin', method: 'removeUser', returnType: 'Promise<boolean>' },
  { className: 'Admin', method: 'replSetGetStatus', returnType: 'Promise<Document>' },
  { className: 'Admin', method: 'serverInfo', returnType: 'Promise<Document>' },
  { className: 'Admin', method: 'serverStatus', returnType: 'Promise<Document>' },
  { className: 'Admin', method: 'validateCollection', returnType: 'Promise<Document>' },

  { className: 'AggregationCursor', method: 'explain', returnType: 'Promise<Document>', possibleCallbackPositions: [1, 2, 3] },
  { className: 'AggregationCursor', method: 'clone', returnType: 'AggregationCursor', notAsync: true },

  { className: 'FindCursor', method: 'clone', returnType: 'FindCursor', notAsync: true },
  { className: 'ListIndexesCursor', method: 'clone', returnType: 'ListIndexesCursor', notAsync: true },
  { className: 'ListCollectionsCursor', method: 'clone', returnType: 'ListCollectionsCursor', notAsync: true },


  // Super class of Unordered/Ordered Bulk operations
  // This is listed here as a reference for completeness, but it is tested by the subclass overrides of execute
  // { className: 'BulkOperationBase', method: 'execute', returnType: 'Promise<BulkWriteResult>' },
  { className: 'OrderedBulkOperation', method: 'execute', returnType: 'Promise<BulkWriteResult>' },
  { className: 'UnorderedBulkOperation', method: 'execute', returnType: 'Promise<BulkWriteResult>' },

  { className: 'ChangeStream', method: 'close', returnType: 'Promise<void>', possibleCallbackPositions: [1, 2]},
  { className: 'ChangeStream', method: 'hasNext', returnType: 'Promise<boolean>' },
  { className: 'ChangeStream', method: 'next', returnType: 'Promise<TChange>' },
  { className: 'ChangeStream', method: 'tryNext', returnType: 'Promise<Document | null>' },

  { className: 'ClientSession', method: 'abortTransaction', returnType: 'Promise<Document>', possibleCallbackPositions: [1, 2] },
  { className: 'ClientSession', method: 'commitTransaction', returnType: 'Promise<Document>', possibleCallbackPositions: [1, 2] },
  { className: 'ClientSession', method: 'endSession', returnType: 'Promise<void>' },
  { className: 'ClientSession', method: 'withTransaction', returnType: 'Promise<void>', notAsync: true },

  { className: 'Collection', method: 'bulkWrite', returnType: 'Promise<BulkWriteResult>' },
  { className: 'Collection', method: 'count', returnType: 'Promise<number>', possibleCallbackPositions: [1, 2, 3] },
  { className: 'Collection', method: 'countDocuments', returnType: 'Promise<number>', possibleCallbackPositions: [1, 2, 3] },
  { className: 'Collection', method: 'createIndex', returnType: 'Promise<string>' },
  { className: 'Collection', method: 'createIndexes', returnType: 'Promise<string[]>' },
  { className: 'Collection', method: 'deleteMany', returnType: 'Promise<DeleteResult>', possibleCallbackPositions: [1, 2, 3] },
  { className: 'Collection', method: 'deleteOne', returnType: 'Promise<DeleteResult>', possibleCallbackPositions: [1, 2, 3] },
  { className: 'Collection', method: 'distinct', returnType: 'Promise<Array<Flatten<WithId<TSchema>[Key]>>>', possibleCallbackPositions: [1, 2, 3] },
  { className: 'Collection', method: 'drop', returnType: 'Promise<boolean>' },
  { className: 'Collection', method: 'dropIndex', returnType: 'Promise<Document>' },
  { className: 'Collection', method: 'dropIndexes', returnType: 'Promise<Document>' },
  { className: 'Collection', method: 'estimatedDocumentCount', returnType: 'Promise<number>' },
  { className: 'Collection', method: 'findOne', returnType: 'Promise<WithId<TSchema> | null>', possibleCallbackPositions: [1, 2, 3] },
  { className: 'Collection', method: 'findOneAndDelete', returnType: 'Promise<ModifyResult<TSchema>>', possibleCallbackPositions: [1, 2, 3] },
  { className: 'Collection', method: 'findOneAndReplace', returnType: 'Promise<ModifyResult<TSchema>>' },
  { className: 'Collection', method: 'findOneAndUpdate', returnType: 'Promise<ModifyResult<TSchema>>' },
  { className: 'Collection', method: 'indexes', returnType: 'Promise<Document[]>' },
  { className: 'Collection', method: 'indexExists', returnType: 'Promise<boolean>' },
  { className: 'Collection', method: 'indexInformation', returnType: 'Promise<Document>' },
  { className: 'Collection', method: 'insertMany', returnType: 'Promise<InsertManyResult<TSchema>>' },
  { className: 'Collection', method: 'insertOne', returnType: 'Promise<InsertOneResult<TSchema>>' },
  { className: 'Collection', method: 'isCapped', returnType: 'Promise<boolean>' },
  { className: 'Collection', method: 'options', returnType: 'Promise<Document>' },
  { className: 'Collection', method: 'rename', returnType: 'Promise<Collection>', changesPromise: true },
  { className: 'Collection', method: 'replaceOne', returnType: 'Promise<UpdateResult | Document>' },
  { className: 'Collection', method: 'updateMany', returnType: 'Promise<UpdateResult | Document>' },
  { className: 'Collection', method: 'updateOne', returnType: 'Promise<UpdateResult>' },
  { className: 'Collection', method: 'initializeOrderedBulkOp', returnType: 'OrderedBulkOperation', notAsync: true },
  { className: 'Collection', method: 'initializeUnorderedBulkOp', returnType: 'UnorderedBulkOperation', notAsync: true },
  { className: 'Collection', method: 'aggregate', returnType: 'AggregationCursor', notAsync: true },
  { className: 'Collection', method: 'find', returnType: 'FindCursor', notAsync: true },
  { className: 'Collection', method: 'listIndexes', returnType: 'ListIndexesCursor', notAsync: true },
  { className: 'Collection', method: 'watch', returnType: 'ChangeStream', notAsync: true },

  { className: 'Db', method: 'collections', returnType: 'Promise<Collection[]>', changesPromise: true },
  { className: 'Db', method: 'command', returnType: 'Promise<Document>' },
  { className: 'Db', method: 'createCollection', returnType: 'Promise<Collection<TSchema>>', changesPromise: true },
  { className: 'Db', method: 'createIndex', returnType: 'Promise<string>' },
  { className: 'Db', method: 'dropCollection', returnType: 'Promise<boolean>' },
  { className: 'Db', method: 'dropDatabase', returnType: 'Promise<boolean>' },
  { className: 'Db', method: 'indexInformation', returnType: 'Promise<Document>' },
  { className: 'Db', method: 'profilingLevel', returnType: 'Promise<string>' },
  { className: 'Db', method: 'removeUser', returnType: 'Promise<boolean>' },
  { className: 'Db', method: 'renameCollection', returnType: 'Promise<Collection<TSchema>>', changesPromise: true },
  { className: 'Db', method: 'setProfilingLevel', returnType: 'Promise<ProfilingLevel>' },
  { className: 'Db', method: 'stats', returnType: 'Promise<Document>' },
  { className: 'Db', method: 'collection', returnType: 'Collection', notAsync: true },
  { className: 'Db', method: 'admin', returnType: 'Admin', notAsync: true },
  { className: 'Db', method: 'aggregate', returnType: 'AggregationCursor', notAsync: true },
  { className: 'Db', method: 'listCollections', returnType: 'ListCollectionsCursor', notAsync: true },
  { className: 'Db', method: 'watch', returnType: 'ChangeStream', notAsync: true },

  { className: 'FindCursor', method: 'count', returnType: 'Promise<number>' },
  { className: 'FindCursor', method: 'explain', returnType: 'Promise<Document>', possibleCallbackPositions: [1,2,3] },

  { className: 'GridFSBucket', method: 'delete', returnType: 'Promise<void>', possibleCallbackPositions: [1, 2] },
  { className: 'GridFSBucket', method: 'drop', returnType: 'Promise<void>', possibleCallbackPositions: [1, 2] },
  { className: 'GridFSBucket', method: 'rename', returnType: 'Promise<void>', possibleCallbackPositions: [1, 2] },
  { className: 'GridFSBucket', method: 'openUploadStream', returnType: 'GridFSBucketWriteStream', notAsync: true },
  { className: 'GridFSBucket', method: 'openUploadStreamWithId', returnType: 'GridFSBucketWriteStream', notAsync: true },
  { className: 'GridFSBucket', method: 'find', returnType: 'FindCursor', notAsync: true },

  { className: 'GridFSBucketWriteStream', method: 'abort', returnType: 'Promise<void>' },

  { className: 'MongoClient', method: 'close', returnType: 'Promise<void>' },
  { className: 'MongoClient', method: 'connect', returnType: 'Promise<this>', changesPromise: true },
  { className: 'MongoClient', method: 'startSession', returnType: 'ClientSession', notAsync: true },
  { className: 'MongoClient', method: 'db', returnType: 'Db', notAsync: true },
  { className: 'MongoClient', method: 'watch', returnType: 'ChangeStream', notAsync: true },
  // Special case, calls toLegacy before executor callback
  { className: 'MongoClient', method: 'withSession', returnType: 'Promise<void>', notAsync: true },
  // Manually test the static version of connect
  // This is listed here as a reference for completeness, but it is tested manually
  // it is checked to exist in index.test.js
  // its functionally tested in maybe_callback.test.js
  // { className: 'MongoClient', method: 'static connect', returnType: 'Promise<this>' },
];

module.exports.api = api;
module.exports.classNames = new Set(api.map(({ className }) => className))
module.exports.classNameToMethodList = new Map(api.map((api, _, array) =>
  [api.className, sorted(Array.from(new Set(Array.from(array.filter(v => v.className === api.className), method => method))), (a, b) => byStrings(a.method, b.method))]
));
