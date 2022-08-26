'use strict';

const {
  MongoClient,
  FindCursor,
  ListIndexesCursor,
  ChangeStream,
  AggregationCursor,
  Collection
} = require('../../../src/index');
const mongodbDriver = require('mongodb');
const sinon = require('sinon');
const { expect } = require('chai');

const iLoveJs = 'mongodb://iLoveJavascript';

describe('legacy_wrappers/collection.js', () => {
  let client;
  let collection;
  beforeEach(async function () {
    client = new MongoClient(iLoveJs);
    collection = client.db().collection('test');
  });

  afterEach(async function () {
    sinon.restore();
    await client.close();
  });

  it('should return legacy listIndexes cursor', () => {
    expect(collection.listIndexes()).to.be.instanceOf(ListIndexesCursor);
  });

  it('should return legacy ChangeStream', () => {
    expect(collection.watch()).to.be.instanceOf(ChangeStream);
  });

  it('should return legacy ChangeStream', () => {
    expect(collection.aggregate()).to.be.instanceOf(AggregationCursor);
  });

  it('should return legacy FindCursor', () => {
    expect(collection.find()).to.be.instanceOf(FindCursor);
  });

  it('should support rename(newName)', async () => {
    const stub = sinon
      .stub(mongodbDriver.Collection.prototype, 'rename')
      .returns(Promise.resolve(new mongodbDriver.Collection(client.db(), 'test')));
    const result = await collection.rename('newName');
    expect(result).to.be.instanceOf(Collection);
    expect(stub).to.be.calledWithExactly('newName', undefined);
  });

  it('should support rename(newName, options)', async () => {
    const stub = sinon
      .stub(mongodbDriver.Collection.prototype, 'rename')
      .returns(Promise.resolve(new mongodbDriver.Collection(client.db(), 'test')));
    const result = await collection.rename('newName', { options: true });
    expect(result).to.be.instanceOf(Collection);
    expect(stub).to.be.calledWithExactly('newName', { options: true });
  });

  it('should support rename(newName, callback)', done => {
    const stub = sinon
      .stub(mongodbDriver.Collection.prototype, 'rename')
      .returns(Promise.resolve(new mongodbDriver.Collection(client.db(), 'test')));
    collection.rename('newName', (error, result) => {
      try {
        expect(error).to.be.undefined;
        expect(result).to.be.instanceOf(Collection);
        done();
      } catch (assertionError) {
        done(assertionError);
      }
    });
    expect(stub).to.be.calledWithExactly('newName', undefined);
  });

  it('should support rename(newName, options, callback)', done => {
    const stub = sinon
      .stub(mongodbDriver.Collection.prototype, 'rename')
      .returns(Promise.resolve(new mongodbDriver.Collection(client.db(), 'test')));
    collection.rename('newName', { options: true }, (error, result) => {
      try {
        expect(error).to.be.undefined;
        expect(result).to.be.instanceOf(Collection);
        done();
      } catch (assertionError) {
        done(assertionError);
      }
    });
    expect(stub).to.be.calledWithExactly('newName', { options: true });
  });
});
