'use strict';

const {
  MongoClient: LegacyMongoClient,
  ListCollectionsCursor: LegacyListCollectionsCursor,
  ChangeStream: LegacyChangeStream,
  AggregationCursor: LegacyAggregationCursor,
  Admin: LegacyAdmin
} = require('../../../src/index');
const { Db } = require('mongodb');
const sinon = require('sinon');
const { expect } = require('chai');
const { runMicroTask } = require('../../tools/utils');

describe('legacy_wrappers/db.js', () => {
  let db;
  let client;
  beforeEach(async function () {
    client = new LegacyMongoClient('mongodb://iLoveJs');
    db = client.db();
  });

  afterEach(async function () {
    sinon.restore();
    await client.close();
  });

  it('should return legacy listCollections cursor', () => {
    expect(db.listCollections()).to.be.instanceOf(LegacyListCollectionsCursor);
  });

  it('db.listCollections().clone() should return legacy listCollections cursor', () => {
    expect(db.listCollections().clone()).to.be.instanceOf(LegacyListCollectionsCursor);
  });

  it('should return legacy ChangeStream', () => {
    expect(db.watch()).to.be.instanceOf(LegacyChangeStream);
  });

  it('should return legacy AggregationCursor', () => {
    expect(db.aggregate()).to.be.instanceOf(LegacyAggregationCursor);
  });

  it('should return legacy Admin', () => {
    expect(db.admin()).to.be.instanceOf(LegacyAdmin);
  });

  describe('renameCollection()', () => {
    let db;
    let stubbedMethod;
    let callback;
    let superPromise;
    let actualReturnValue;

    beforeEach(async () => {
      client = new LegacyMongoClient('mongodb://iLoveJs');
      db = client.db();
      superPromise = Promise.resolve(client.db().collection('newName'));
      stubbedMethod = sinon.stub(Db.prototype, 'renameCollection').returns(superPromise);
      callback = sinon.stub();
    });

    describe(`and renameCollection is called with ('oldName', 'newName', callback)`, () => {
      beforeEach(() => {
        actualReturnValue = db.renameCollection('oldName', 'newName', callback);
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

      it(`should pass only ('oldName', 'newName') to the driver api`, () => {
        expect(stubbedMethod).to.have.been.calledOnceWithExactly('oldName', 'newName', undefined);
      });
    });

    describe(`and renameCollection is called with ('oldName', 'newName', options, callback)`, () => {
      beforeEach(() => {
        actualReturnValue = db.renameCollection('oldName', 'newName', { options: true }, callback);
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

      it(`should pass only ('oldName', 'newName', options) to the driver api`, () => {
        expect(stubbedMethod).to.have.been.calledOnceWithExactly('oldName', 'newName', {
          options: true
        });
      });
    });

    describe(`and renameCollection is called with ('oldName', 'newName')`, () => {
      beforeEach(() => {
        actualReturnValue = db.renameCollection('oldName', 'newName');
      });

      it('should return a Promise', () => expect(actualReturnValue).to.be.instanceOf(Promise));

      it('should resolve the promise with a successful result', async () => {
        const result = await actualReturnValue;
        expect(result).to.have.nested.property('s.namespace.collection', 'newName');
      });

      it(`should pass only ('oldName', 'newName', options) to the driver api`, () => {
        expect(stubbedMethod).to.have.been.calledOnceWithExactly('oldName', 'newName', undefined);
      });
    });

    describe(`and renameCollection is called with ('oldName', 'newName', options)`, () => {
      beforeEach(() => {
        actualReturnValue = db.renameCollection('oldName', 'newName', { options: true });
      });

      it('should return a Promise', () => expect(actualReturnValue).to.be.instanceOf(Promise));

      it('should resolve the promise with a successful result', async () => {
        const result = await actualReturnValue;
        expect(result).to.have.nested.property('s.namespace.collection', 'newName');
      });

      it(`should pass only ('oldName', 'newName', options) to the driver api`, () => {
        expect(stubbedMethod).to.have.been.calledOnceWithExactly('oldName', 'newName', {
          options: true
        });
      });
    });
  });

  describe('createCollection()', () => {
    let db;
    let stubbedMethod;
    let callback;
    let superPromise;
    let actualReturnValue;

    beforeEach(async () => {
      client = new LegacyMongoClient('mongodb://iLoveJs');
      db = client.db();
      superPromise = Promise.resolve(client.db().collection('test'));
      stubbedMethod = sinon.stub(Db.prototype, 'createCollection').returns(superPromise);
      callback = sinon.stub();
    });

    describe(`and createCollection is called with ('test', callback)`, () => {
      beforeEach(() => {
        actualReturnValue = db.createCollection('test', callback);
      });

      it('should return void', () => expect(actualReturnValue).to.be.undefined);

      it('should call the callback with undefined error and successful result', async () => {
        await superPromise;
        await runMicroTask();
        const calls = callback.getCalls();
        expect(calls).to.have.lengthOf(1);
        expect(calls[0].args[0]).to.be.undefined;
        expect(calls[0].args[1]).to.have.nested.property('s.namespace.collection', 'test');
      });

      it(`should pass only ('oldName', 'newName') to the driver api`, () => {
        expect(stubbedMethod).to.have.been.calledOnceWithExactly('test', undefined);
      });
    });

    describe(`and createCollection is called with ('test', options, callback)`, () => {
      beforeEach(() => {
        actualReturnValue = db.createCollection('test', { options: true }, callback);
      });

      it('should return void', () => expect(actualReturnValue).to.be.undefined);

      it('should call the callback with undefined error and successful result', async () => {
        await superPromise;
        await runMicroTask();
        const calls = callback.getCalls();
        expect(calls).to.have.lengthOf(1);
        expect(calls[0].args[0]).to.be.undefined;
        expect(calls[0].args[1]).to.have.nested.property('s.namespace.collection', 'test');
      });

      it(`should pass only ('test', options) to the driver api`, () => {
        expect(stubbedMethod).to.have.been.calledOnceWithExactly('test', { options: true });
      });
    });

    describe(`and createCollection is called with ('test')`, () => {
      beforeEach(() => {
        actualReturnValue = db.createCollection('test');
      });

      it('should return a Promise', () => expect(actualReturnValue).to.be.instanceOf(Promise));

      it('should resolve the promise with a successful result', async () => {
        const result = await actualReturnValue;
        expect(result).to.have.nested.property('s.namespace.collection', 'test');
      });

      it(`should pass only ('test') to the driver api`, () => {
        expect(stubbedMethod).to.have.been.calledOnceWithExactly('test', undefined);
      });
    });

    describe(`and createCollection is called with ('test', options)`, () => {
      beforeEach(() => {
        actualReturnValue = db.createCollection('test', { options: true });
      });

      it('should return a Promise', () => expect(actualReturnValue).to.be.instanceOf(Promise));

      it('should resolve the promise with a successful result', async () => {
        const result = await actualReturnValue;
        expect(result).to.have.nested.property('s.namespace.collection', 'test');
      });

      it(`should pass only ('test', options) to the driver api`, () => {
        expect(stubbedMethod).to.have.been.calledOnceWithExactly('test', { options: true });
      });
    });
  });

  describe('collections()', () => {
    let db;
    let stubbedMethod;
    let callback;
    let superPromise;
    let actualReturnValue;

    beforeEach(async () => {
      client = new LegacyMongoClient('mongodb://iLoveJs');
      db = client.db();
      superPromise = Promise.resolve([client.db().collection('test')]);
      stubbedMethod = sinon.stub(Db.prototype, 'collections').returns(superPromise);
      callback = sinon.stub();
    });

    describe(`and collections is called with (callback)`, () => {
      beforeEach(() => {
        actualReturnValue = db.collections(callback);
      });

      it('should return void', () => expect(actualReturnValue).to.be.undefined);

      it('should call the callback with undefined error and successful result', async () => {
        await superPromise;
        await runMicroTask();
        const calls = callback.getCalls();
        expect(calls).to.have.lengthOf(1);
        expect(calls[0].args[0]).to.be.undefined;
        expect(calls[0].args[1]).to.be.an('array');
      });

      it(`should pass only () to the driver api`, () => {
        expect(stubbedMethod).to.have.been.calledOnceWithExactly(undefined);
      });
    });

    describe(`and collections is called with (options, callback)`, () => {
      beforeEach(() => {
        actualReturnValue = db.collections({ options: true }, callback);
      });

      it('should return void', () => expect(actualReturnValue).to.be.undefined);

      it('should call the callback with undefined error and successful result', async () => {
        await superPromise;
        await runMicroTask();
        const calls = callback.getCalls();
        expect(calls).to.have.lengthOf(1);
        expect(calls[0].args[0]).to.be.undefined;
        expect(calls[0].args[1]).to.be.an('array');
      });

      it(`should pass only (options) to the driver api`, () => {
        expect(stubbedMethod).to.have.been.calledOnceWithExactly({ options: true });
      });
    });

    describe(`and createCollection is called with ()`, () => {
      beforeEach(() => {
        actualReturnValue = db.collections();
      });

      it('should return a Promise', () => expect(actualReturnValue).to.be.instanceOf(Promise));

      it('should resolve the promise with a successful result', async () => {
        const result = await actualReturnValue;
        expect(result).to.be.an('array');
      });

      it(`should pass only () to the driver api`, () => {
        expect(stubbedMethod).to.have.been.calledOnceWithExactly(undefined);
      });
    });

    describe(`and createCollection is called with (options)`, () => {
      beforeEach(() => {
        actualReturnValue = db.collections({ options: true });
      });

      it('should return a Promise', () => expect(actualReturnValue).to.be.instanceOf(Promise));

      it('should resolve the promise with a successful result', async () => {
        const result = await actualReturnValue;
        expect(result).to.be.an('array');
      });

      it(`should pass only (options) to the driver api`, () => {
        expect(stubbedMethod).to.have.been.calledOnceWithExactly({ options: true });
      });
    });
  });
});
