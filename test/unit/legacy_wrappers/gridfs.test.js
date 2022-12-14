'use strict';

const {
  MongoClient: LegacyMongoClient,
  GridFSBucket: LegacyGridFSBucket,
  FindCursor: LegacyFindCursor,
  GridFSBucketWriteStream: LegacyGridFSBucketWriteStream
} = require('../../../src/index');
const mongodbDriver = require('mongodb');
const sinon = require('sinon');
const { expect } = require('chai');
const { toLegacy } = require('../../../src/utils');

const iLoveJs = 'mongodb://iLoveJavascript';

describe('legacy_wrappers/gridfs.js', () => {
  let client;
  let bucket;
  beforeEach(async function () {
    client = new LegacyMongoClient(iLoveJs);
    bucket = new LegacyGridFSBucket(client.db());
  });

  afterEach(async function () {
    sinon.restore();
    await client.close();
  });

  it('should convert FindCursor returned by bucket.find to legacy version', () => {
    const spy = sinon.spy(mongodbDriver.GridFSBucket.prototype, 'find');
    const find = bucket.find({ filter: 1 }, { options: true });
    expect(find).to.be.instanceOf(LegacyFindCursor);
    expect(spy).to.be.calledWithExactly({ filter: 1 }, { options: true });
  });

  // We do not have an API that returns a bucket, users just use the constructor
  // however, it may be useful to have this exist for a quick way to fix inconsistent instances
  it('should define a toLegacy helper', () => {
    expect(bucket[toLegacy]()).to.be.instanceOf(LegacyGridFSBucket);
  });

  it('should return legacy GridFSBucketWriteStream from openUploadStream', () => {
    expect(bucket.openUploadStream('filename')).to.be.instanceOf(LegacyGridFSBucketWriteStream);
  });

  it('should return legacy GridFSBucketWriteStream from openUploadStreamWithId', () => {
    expect(bucket.openUploadStreamWithId(0, 'filename')).to.be.instanceOf(
      LegacyGridFSBucketWriteStream
    );
  });
});
