/* eslint-disable prettier/prettier */
'use strict';

module.exports = Object.create(null);
Object.defineProperty(module.exports, '__esModule', { value: true });

const commonCursorApis = [
  { className: 'AbstractCursor', method: 'close', returnType: 'Promise<void>' },
  { className: 'AbstractCursor', method: 'forEach', returnType: 'Promise<void>' },
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

const asyncApi = [
  // Super class of cursors, we do not directly override these but override them in the inherited classes
  ...commonCursorApis.flatMap(({ method, returnType }) => cursorClasses.map(cursorClass => ({ className: cursorClass, method, returnType }))),

  { className: 'Admin', method: 'addUser', returnType: 'Promise<Document>' },
  { className: 'Admin', method: 'buildInfo', returnType: 'Promise<Document>' },
  { className: 'Admin', method: 'command', returnType: 'Promise<Document>' },
  { className: 'Admin', method: 'listDatabases', returnType: 'Promise<ListDatabasesResult>' },
  { className: 'Admin', method: 'ping', returnType: 'Promise<Document>' },
  { className: 'Admin', method: 'removeUser', returnType: 'Promise<boolean>' },
  { className: 'Admin', method: 'replSetGetStatus', returnType: 'Promise<Document>' },
  { className: 'Admin', method: 'serverInfo', returnType: 'Promise<Document>' },
  { className: 'Admin', method: 'serverStatus', returnType: 'Promise<Document>' },
  { className: 'Admin', method: 'validateCollection', returnType: 'Promise<Document>' },

  { className: 'AggregationCursor', method: 'explain', returnType: 'Promise<Document>' },

  // Super class of Unordered/Ordered Bulk operations
  // This is listed here as a reference for completeness, but it is tested manually
  // { className: 'BulkOperationBase', method: 'execute', returnType: 'Promise<BulkWriteResult>' },
  { className: 'OrderedBulkOperation', method: 'execute', returnType: 'Promise<BulkWriteResult>' },
  { className: 'UnorderedBulkOperation', method: 'execute', returnType: 'Promise<BulkWriteResult>' },

  { className: 'ChangeStream', method: 'close', returnType: 'Promise<void>' },
  { className: 'ChangeStream', method: 'hasNext', returnType: 'Promise<boolean>' },
  { className: 'ChangeStream', method: 'next', returnType: 'Promise<TChange>' },
  { className: 'ChangeStream', method: 'tryNext', returnType: 'Promise<Document | null>' },

  { className: 'ClientSession', method: 'abortTransaction', returnType: 'Promise<Document>' },
  { className: 'ClientSession', method: 'commitTransaction', returnType: 'Promise<Document>' },
  { className: 'ClientSession', method: 'endSession', returnType: 'Promise<void>' },

  { className: 'Collection', method: 'bulkWrite', returnType: 'Promise<BulkWriteResult>' },
  { className: 'Collection', method: 'count', returnType: 'Promise<number>' },
  { className: 'Collection', method: 'countDocuments', returnType: 'Promise<number>' },
  { className: 'Collection', method: 'createIndex', returnType: 'Promise<string>' },
  { className: 'Collection', method: 'createIndexes', returnType: 'Promise<string[]>' },
  { className: 'Collection', method: 'deleteMany', returnType: 'Promise<DeleteResult>' },
  { className: 'Collection', method: 'deleteOne', returnType: 'Promise<DeleteResult>' },
  { className: 'Collection', method: 'distinct', returnType: 'Promise<Array<Flatten<WithId<TSchema>[Key]>>>' },
  { className: 'Collection', method: 'drop', returnType: 'Promise<boolean>' },
  { className: 'Collection', method: 'dropIndex', returnType: 'Promise<Document>' },
  { className: 'Collection', method: 'dropIndexes', returnType: 'Promise<Document>' },
  { className: 'Collection', method: 'estimatedDocumentCount', returnType: 'Promise<number>' },
  { className: 'Collection', method: 'findOne', returnType: 'Promise<WithId<TSchema> | null>' },
  { className: 'Collection', method: 'findOneAndDelete', returnType: 'Promise<ModifyResult<TSchema>>' },
  { className: 'Collection', method: 'findOneAndReplace', returnType: 'Promise<ModifyResult<TSchema>>' },
  { className: 'Collection', method: 'findOneAndUpdate', returnType: 'Promise<ModifyResult<TSchema>>' },
  { className: 'Collection', method: 'indexes', returnType: 'Promise<Document[]>' },
  { className: 'Collection', method: 'indexExists', returnType: 'Promise<boolean>' },
  { className: 'Collection', method: 'indexInformation', returnType: 'Promise<Document>' },
  { className: 'Collection', method: 'insert', returnType: 'Promise<InsertManyResult<TSchema>> | void' },
  { className: 'Collection', method: 'insertMany', returnType: 'Promise<InsertManyResult<TSchema>>' },
  { className: 'Collection', method: 'insertOne', returnType: 'Promise<InsertOneResult<TSchema>>' },
  { className: 'Collection', method: 'isCapped', returnType: 'Promise<boolean>' },
  { className: 'Collection', method: 'mapReduce', returnType: 'Promise<Document | Document[]>' },
  { className: 'Collection', method: 'options', returnType: 'Promise<Document>' },
  { className: 'Collection', method: 'remove', returnType: 'Promise<DeleteResult> | void' },
  { className: 'Collection', method: 'rename', returnType: 'Promise<Collection>' },
  { className: 'Collection', method: 'replaceOne', returnType: 'Promise<UpdateResult | Document>' },
  { className: 'Collection', method: 'stats', returnType: 'Promise<CollStats>' },
  { className: 'Collection', method: 'update', returnType: 'Promise<UpdateResult> | void' },
  { className: 'Collection', method: 'updateMany', returnType: 'Promise<UpdateResult | Document>' },
  { className: 'Collection', method: 'updateOne', returnType: 'Promise<UpdateResult>' },

  { className: 'Db', method: 'addUser', returnType: 'Promise<Document>' },
  { className: 'Db', method: 'collections', returnType: 'Promise<Collection[]>' },
  { className: 'Db', method: 'command', returnType: 'Promise<Document>' },
  { className: 'Db', method: 'createCollection', returnType: 'Promise<Collection<TSchema>>' },
  { className: 'Db', method: 'createIndex', returnType: 'Promise<string>' },
  { className: 'Db', method: 'dropCollection', returnType: 'Promise<boolean>' },
  { className: 'Db', method: 'dropDatabase', returnType: 'Promise<boolean>' },
  { className: 'Db', method: 'indexInformation', returnType: 'Promise<Document>' },
  { className: 'Db', method: 'profilingLevel', returnType: 'Promise<string>' },
  { className: 'Db', method: 'removeUser', returnType: 'Promise<boolean>' },
  { className: 'Db', method: 'renameCollection', returnType: 'Promise<Collection<TSchema>>' },
  { className: 'Db', method: 'setProfilingLevel', returnType: 'Promise<ProfilingLevel>' },
  { className: 'Db', method: 'stats', returnType: 'Promise<Document>' },

  { className: 'FindCursor', method: 'count', returnType: 'Promise<number>' },
  { className: 'FindCursor', method: 'explain', returnType: 'Promise<Document>' },

  { className: 'GridFSBucket', method: 'delete', returnType: 'Promise<void>' },
  { className: 'GridFSBucket', method: 'drop', returnType: 'Promise<void>' },
  { className: 'GridFSBucket', method: 'rename', returnType: 'Promise<void>' },

  { className: 'GridFSBucketWriteStream', method: 'abort', returnType: 'Promise<void>' },

  { className: 'MongoClient', method: 'close', returnType: 'Promise<void>' },
  { className: 'MongoClient', method: 'connect', returnType: 'Promise<this>' },
  // Manually test the static version of connect
  // This is listed here as a reference for completeness, but it is tested manually
  // { className: 'MongoClient', method: 'static connect', returnType: 'Promise<this>' },
];

const transformMethods = [
  { className: 'MongoClient', method: 'startSession', returnType: 'ClientSession' },
  { className: 'MongoClient', method: 'db', returnType: 'Db' },
  { className: 'MongoClient', method: 'watch', returnType: 'ChangeStream' },
  // Special case, calls toLegacy before executor callback
  { className: 'MongoClient', method: 'withSession', returnType: 'Promise<void>' },

  { className: 'Db', method: 'collection', returnType: 'Collection' },
  { className: 'Db', method: 'admin', returnType: 'Admin' },
  { className: 'Db', method: 'aggregate', returnType: 'AggregationCursor' },
  { className: 'Db', method: 'listCollections', returnType: 'ListCollectionsCursor' },
  { className: 'Db', method: 'watch', returnType: 'ChangeStream' },
  { className: 'Db', method: 'collections', returnType: 'Promise<Collection[]>' },
  { className: 'Db', method: 'renameCollection', returnType: 'Promise<Collection>' },
  { className: 'Db', method: 'createCollection', returnType: 'Promise<Collection>' },

  { className: 'Collection', method: 'aggregate', returnType: 'AggregationCursor' },
  { className: 'Collection', method: 'find', returnType: 'FindCursor' },
  { className: 'Collection', method: 'listIndexes', returnType: 'ListIndexesCursor' },
  { className: 'Collection', method: 'watch', returnType: 'ChangeStream' },

  { className: 'GridFSBucket', method: 'find', returnType: 'FindCursor' },

  // Special case, calls toLegacy before executor callback
  { className: 'ClientSession', method: 'withTransaction', returnType: 'Promise<void>' },

];

module.exports.asyncApi = asyncApi;
module.exports.transformMethods = transformMethods;
module.exports.asyncApiClasses = new Set(asyncApi.map(({className}) => className))
module.exports.classNameToMethodList = new Map([...asyncApi, ...transformMethods].map((api, _, array) => {
  const methodNames = Array.from(new Set(Array.from(array.filter(v => v.className === api.className), ({ method }) => method)))
  methodNames.sort((a, b) => a.localeCompare(b))
  return [api.className, methodNames]
}));
