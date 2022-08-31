'use strict';

const {
  MongoClient,
  GridFSBucket,
  FindCursor,
  GridFSBucketWriteStream
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
    client = new MongoClient(iLoveJs);
    bucket = new GridFSBucket(client.db());
  });

  afterEach(async function () {
    sinon.restore();
    await client.close();
  });

  it("should convert bucket.find's FindCursor to legacy version", () => {
    const spy = sinon.spy(mongodbDriver.GridFSBucket.prototype, 'find');
    const find = bucket.find({ filter: 1 }, { options: true });
    expect(find).to.be.instanceOf(FindCursor);
    expect(spy).to.be.calledWithExactly({ filter: 1 }, { options: true });
  });

  // We do not have an API that returns a bucket, users just use the constructor
  // however, it may be useful to have this exist for a quick way to fix inconsistent instances
  it('should define a toLegacy helper', () => {
    expect(bucket[toLegacy]()).to.be.instanceOf(GridFSBucket);
  });

  it('should return legacy GridFSBucketWriteStream from openUploadStream', () => {
    expect(bucket.openUploadStream('filename')).to.be.instanceOf(GridFSBucketWriteStream);
  });
  it('should return legacy GridFSBucketWriteStream from openUploadStreamWithId', () => {
    expect(bucket.openUploadStreamWithId(0, 'filename')).to.be.instanceOf(GridFSBucketWriteStream);
  });

  it('should support GridFSBucketWriteStream.abort(callback)', done => {
    const stub = sinon
      .stub(mongodbDriver.GridFSBucketWriteStream.prototype, 'abort')
      .returns(Promise.resolve());
    const stream = bucket.openUploadStream('filename');
    stream.abort(error => {
      try {
        expect(error).to.be.undefined;
        done();
      } catch (assertionError) {
        done(assertionError);
      }
    });
    expect(stub).to.be.calledWithExactly();
  });

  it('should support GridFSBucketWriteStream.abort()', async () => {
    const stub = sinon
      .stub(mongodbDriver.GridFSBucketWriteStream.prototype, 'abort')
      .returns(Promise.resolve());
    const stream = bucket.openUploadStream('filename');
    const result = stream.abort();
    expect(result).to.be.instanceOf(Promise);
    expect(stub).to.be.calledWithExactly();
  });
});
