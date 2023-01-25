'use strict';

const {
  MongoClient: LegacyMongoClient,
  FindCursor: LegacyFindCursor,
  ListIndexesCursor: LegacyListIndexesCursor,
  ChangeStream: LegacyChangeStream,
  AggregationCursor: LegacyAggregationCursor
} = require('../../../src/index');
const mongodbDriver = require('mongodb');
const sinon = require('sinon');
const { expect } = require('chai');
const { runMicroTask } = require('../../tools/utils');

const iLoveJs = 'mongodb://iLoveJavascript';

describe('legacy_wrappers/collection.js', () => {
  let client;
  let collection;
  beforeEach(async function () {
    client = new LegacyMongoClient(iLoveJs);
    collection = client.db().collection('test');
  });

  afterEach(async function () {
    sinon.restore();
    await client.close();
  });

  it('collection.listIndexes() should return legacy listIndexes cursor', () => {
    expect(collection.listIndexes()).to.be.instanceOf(LegacyListIndexesCursor);
  });

  it('collection.watch() should return legacy ChangeStream', () => {
    expect(collection.watch()).to.be.instanceOf(LegacyChangeStream);
  });

  it('collection.aggregate() should return legacy ChangeStream', () => {
    expect(collection.aggregate()).to.be.instanceOf(LegacyAggregationCursor);
  });

  it('collection.find() should return legacy FindCursor', () => {
    expect(collection.find()).to.be.instanceOf(LegacyFindCursor);
  });

  it('collection.listIndexes().clone() should return legacy listIndexes cursor', () => {
    expect(collection.listIndexes().clone()).to.be.instanceOf(LegacyListIndexesCursor);
  });

  it('collection.aggregate().clone() should return legacy AggregationCursor', () => {
    expect(collection.aggregate().clone()).to.be.instanceOf(LegacyAggregationCursor);
  });

  it('collection.find().clone() should return legacy FindCursor', () => {
    expect(collection.find().clone()).to.be.instanceOf(LegacyFindCursor);
  });

  describe('rename()', () => {
    let client;
    let collection;
    let stubbedMethod;
    let callback;
    let superPromise;
    let actualReturnValue;

    beforeEach(async () => {
      client = new LegacyMongoClient('mongodb://iLoveJs');
      collection = client.db().collection('test');
      superPromise = Promise.resolve(client.db().collection('newName'));
      stubbedMethod = sinon
        .stub(mongodbDriver.Collection.prototype, 'rename')
        .returns(superPromise);
      callback = sinon.stub();
    });

    describe(`rename is called with ('newName', callback)`, () => {
      beforeEach(() => {
        actualReturnValue = collection.rename('newName', callback);
      });

      it('should return void', () => expect(actualReturnValue).to.be.undefined);

      it('should call the callback with undefined error and successful result', async () => {
        await superPromise;
        await runMicroTask();
        const calls = callback.getCalls();
        expect(calls).to.have.lengthOf(1);
        expect(calls[0].args[0]).to.be.undefined;
        expect(calls[0].args[1]).to.have.nested.property('s.namespace.collection', 'newName');
      });

      it(`should pass only ('newName') to the driver api`, () => {
        expect(stubbedMethod).to.have.been.calledOnceWithExactly('newName', undefined);
      });
    });

    describe(`rename is called with ('newName', options, callback)`, () => {
      beforeEach(() => {
        actualReturnValue = collection.rename('newName', { options: true }, callback);
      });

      it('should return void', () => expect(actualReturnValue).to.be.undefined);

      it('should call the callback with undefined error and successful result', async () => {
        await superPromise;
        await runMicroTask();
        const calls = callback.getCalls();
        expect(calls).to.have.lengthOf(1);
        expect(calls[0].args[0]).to.be.undefined;
        expect(calls[0].args[1]).to.have.nested.property('s.namespace.collection', 'newName');
      });

      it(`should pass only ('newName') to the driver api`, () => {
        expect(stubbedMethod).to.have.been.calledOnceWithExactly('newName', { options: true });
      });
    });

    describe(`rename is called with ('newName')`, () => {
      beforeEach(() => {
        actualReturnValue = collection.rename('newName');
      });

      it('should return a Promise', () => expect(actualReturnValue).to.be.instanceOf(Promise));

      it('should resolve the promise with a successful result', async () => {
        const result = await actualReturnValue;
        expect(result).to.have.nested.property('s.namespace.collection', 'newName');
      });

      it(`should pass only ('newName') to the driver api`, () => {
        expect(stubbedMethod).to.have.been.calledOnceWithExactly('newName', undefined);
      });
    });

    describe(`rename is called with ('newName', options)`, () => {
      beforeEach(() => {
        actualReturnValue = collection.rename('newName', { options: true });
      });

      it('should return a Promise', () => expect(actualReturnValue).to.be.instanceOf(Promise));

      it('should resolve the promise with a successful result', async () => {
        const result = await actualReturnValue;
        expect(result).to.have.nested.property('s.namespace.collection', 'newName');
      });

      it(`should pass only ('newName') to the driver api`, () => {
        expect(stubbedMethod).to.have.been.calledOnceWithExactly('newName', { options: true });
      });
    });
  });
});
