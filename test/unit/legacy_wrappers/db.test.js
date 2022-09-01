'use strict';

const {
  MongoClient: LegacyMongoClient,
  ListCollectionsCursor: LegacyListCollectionsCursor,
  ChangeStream: LegacyChangeStream,
  AggregationCursor: LegacyAggregationCursor,
  Collection: LegacyCollection
} = require('../../../src/index');
const mongodbDriver = require('mongodb');
const { Db } = require('mongodb');
const sinon = require('sinon');
const { expect } = require('chai');

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

  it('should return legacy ChangeStream', () => {
    expect(db.watch()).to.be.instanceOf(LegacyChangeStream);
  });

  it('should return legacy AggregationCursor', () => {
    expect(db.aggregate()).to.be.instanceOf(LegacyAggregationCursor);
  });

  describe('addUser()', () => {
    let db;
    let stubbedMethod;
    let callback;
    let superPromise;
    let actualReturnValue;

    beforeEach(async () => {
      client = new LegacyMongoClient('mongodb://iLoveJs');
      db = client.db();
      superPromise = Promise.resolve({ message: 'success!' });
      stubbedMethod = sinon.stub(Db.prototype, 'addUser').returns(superPromise);
      callback = sinon.stub();
    });

    describe(`and addUser is called with ('name', callback)`, () => {
      beforeEach(() => {
        actualReturnValue = db.addUser('name', callback);
      });

      it('should return void', () => expect(actualReturnValue).to.be.undefined);

      it('should call the callback with undefined error and successful result', async () => {
        await superPromise;
        expect(callback).to.have.been.calledOnce;
        const expectedArgs = callback.args[0];
        expect(expectedArgs).to.have.property('0', undefined);
        expect(expectedArgs).to.have.nested.property('[1].message', 'success!');
      });

      it(`should pass only ('name') to the driver api`, () => {
        expect(stubbedMethod).to.have.been.calledOnceWithExactly('name', undefined, undefined);
      });
    });

    describe(`and addUser is called with ('name', 'pass', callback)`, () => {
      beforeEach(() => {
        actualReturnValue = db.addUser('name', 'pass', callback);
      });

      it('should return void', () => expect(actualReturnValue).to.be.undefined);

      it('should call the callback with undefined error and successful result', async () => {
        await superPromise;
        expect(callback).to.have.been.calledOnce;
        const expectedArgs = callback.args[0];
        expect(expectedArgs).to.have.property('0', undefined);
        expect(expectedArgs).to.have.nested.property('[1].message', 'success!');
      });

      it(`should pass only ('name', 'pass') to the driver api`, () => {
        expect(stubbedMethod).to.have.been.calledOnceWithExactly('name', 'pass', undefined);
      });
    });

    describe(`and addUser is called with ('name', 'pass', options, callback)`, () => {
      beforeEach(() => {
        actualReturnValue = db.addUser('name', 'pass', { options: true }, callback);
      });

      it('should return void', () => expect(actualReturnValue).to.be.undefined);

      it('should call the callback with undefined error and successful result', async () => {
        await superPromise;
        expect(callback).to.have.been.calledOnce;
        const expectedArgs = callback.args[0];
        expect(expectedArgs).to.have.property('0', undefined);
        expect(expectedArgs).to.have.nested.property('[1].message', 'success!');
      });

      it(`should pass only ('name', 'pass', options) to the driver api`, () => {
        expect(stubbedMethod).to.have.been.calledOnceWithExactly('name', 'pass', {
          options: true
        });
      });
    });

    describe(`and addUser is called with ('name', options, callback)`, () => {
      beforeEach(() => {
        actualReturnValue = db.addUser('name', { options: true }, callback);
      });

      it('should return void', () => expect(actualReturnValue).to.be.undefined);

      it('should call the callback with undefined error and successful result', async () => {
        await superPromise;
        expect(callback).to.have.been.calledOnce;
        const expectedArgs = callback.args[0];
        expect(expectedArgs).to.have.property('0', undefined);
        expect(expectedArgs).to.have.nested.property('[1].message', 'success!');
      });

      it(`should pass only ('name', undefined, options) to the driver api`, () => {
        expect(stubbedMethod).to.have.been.calledOnceWithExactly('name', undefined, {
          options: true
        });
      });
    });

    describe(`and addUser is called with ('name')`, () => {
      beforeEach(() => {
        actualReturnValue = db.addUser('name');
      });

      it('should return the same promise the driver returns', async () => {
        expect(actualReturnValue).to.equal(superPromise);
      });

      it('should return a resolved promise', async () => {
        const result = await actualReturnValue;
        expect(result).to.have.property('message', 'success!');
      });

      it(`should pass only ('name') to the driver api`, () => {
        expect(stubbedMethod).to.have.been.calledOnceWithExactly('name', undefined, undefined);
      });
    });

    describe(`and addUser is called with ('name', 'pass')`, () => {
      beforeEach(() => {
        actualReturnValue = db.addUser('name', 'pass');
      });

      it('should return the same promise the driver returns', async () => {
        expect(actualReturnValue).to.equal(superPromise);
      });

      it('should return a resolved promise', async () => {
        const result = await actualReturnValue;
        expect(result).to.have.property('message', 'success!');
      });

      it(`should pass only ('name', 'pass') to the driver api`, () => {
        expect(stubbedMethod).to.have.been.calledOnceWithExactly('name', 'pass', undefined);
      });
    });

    describe(`and addUser is called with ('name', 'pass', options)`, () => {
      beforeEach(() => {
        actualReturnValue = db.addUser('name', 'pass', { options: true });
      });

      it('should return the same promise the driver returns', async () => {
        expect(actualReturnValue).to.equal(superPromise);
      });

      it('should return a resolved promise', async () => {
        const result = await actualReturnValue;
        expect(result).to.have.property('message', 'success!');
      });

      it(`should pass only ('name', 'pass', options) to the driver api`, () => {
        expect(stubbedMethod).to.have.been.calledOnceWithExactly('name', 'pass', {
          options: true
        });
      });
    });
  });

  it('should support renameCollection(oldName, newName)', async () => {
    const stub = sinon
      .stub(mongodbDriver.Db.prototype, 'renameCollection')
      .returns(Promise.resolve(new mongodbDriver.Db(client, 'test')));
    const result = await db.renameCollection('oldName', 'newName');
    expect(result).to.be.instanceOf(Db);
    expect(stub).to.be.calledWithExactly('oldName', 'newName', undefined);
  });

  it('should support renameCollection(oldName, newName, options)', async () => {
    const stub = sinon
      .stub(mongodbDriver.Db.prototype, 'renameCollection')
      .returns(Promise.resolve(new mongodbDriver.Db(client, 'test')));
    const result = await db.renameCollection('oldName', 'newName', { options: true });
    expect(result).to.be.instanceOf(Db);
    expect(stub).to.be.calledWithExactly('oldName', 'newName', { options: true });
  });

  it('should support renameCollection(oldName, newName, callback)', done => {
    const stub = sinon
      .stub(mongodbDriver.Db.prototype, 'renameCollection')
      .returns(Promise.resolve(new mongodbDriver.Db(client, 'test')));
    db.renameCollection('oldName', 'newName', (error, result) => {
      try {
        expect(error).to.be.undefined;
        expect(result).to.be.instanceOf(Db);
        done();
      } catch (assertionError) {
        done(assertionError);
      }
    });
    expect(stub).to.be.calledWithExactly('oldName', 'newName', undefined);
  });

  it('should support rename(newName, options, callback)', done => {
    const stub = sinon
      .stub(mongodbDriver.Db.prototype, 'renameCollection')
      .returns(Promise.resolve(new mongodbDriver.Db(client, 'test')));
    db.renameCollection('oldName', 'newName', { options: true }, (error, result) => {
      try {
        expect(error).to.be.undefined;
        expect(result).to.be.instanceOf(Db);
        done();
      } catch (assertionError) {
        done(assertionError);
      }
    });
    expect(stub).to.be.calledWithExactly('oldName', 'newName', { options: true });
  });

  it('support db.createCollection(name)', async () => {
    const returnValue = Promise.resolve(new mongodbDriver.Collection(db, 'a'));
    const stub = sinon.stub(mongodbDriver.Db.prototype, 'createCollection').returns(returnValue);
    const actualReturnValue = db.createCollection('a');
    expect(await actualReturnValue).to.be.instanceOf(LegacyCollection);
    expect(stub).to.be.calledWithExactly('a', undefined);
  });

  it('support db.createCollection(name, options)', async () => {
    const returnValue = Promise.resolve(new mongodbDriver.Collection(db, 'a'));
    const stub = sinon.stub(mongodbDriver.Db.prototype, 'createCollection').returns(returnValue);
    const actualReturnValue = db.createCollection('a', { options: true });
    expect(await actualReturnValue).to.be.instanceOf(LegacyCollection);
    expect(stub).to.be.calledWithExactly('a', { options: true });
  });

  it('support db.createCollection(name, callback)', done => {
    const returnValue = Promise.resolve(new mongodbDriver.Collection(db, 'a'));
    const stub = sinon.stub(mongodbDriver.Db.prototype, 'createCollection').returns(returnValue);
    db.createCollection('a', (error, collection) => {
      try {
        expect(error).to.be.undefined;
        expect(collection).to.be.instanceOf(LegacyCollection);
        done();
      } catch (assertionError) {
        done(assertionError);
      }
    });
    expect(stub).to.be.calledWithExactly('a', undefined);
  });

  it('support db.createCollection(name, options, callback)', done => {
    const returnValue = Promise.resolve(new mongodbDriver.Collection(db, 'a'));
    const stub = sinon.stub(mongodbDriver.Db.prototype, 'createCollection').returns(returnValue);
    db.createCollection('a', { options: true }, (error, collection) => {
      try {
        expect(error).to.be.undefined;
        expect(collection).to.be.instanceOf(LegacyCollection);
        done();
      } catch (assertionError) {
        done(assertionError);
      }
    });
    expect(stub).to.be.calledWithExactly('a', { options: true });
  });

  it('support db.collections()', async () => {
    const returnValue = Promise.resolve([
      new mongodbDriver.Collection(db, 'a'),
      new mongodbDriver.Collection(db, 'b')
    ]);
    const stub = sinon.stub(mongodbDriver.Db.prototype, 'collections').returns(returnValue);
    const actualReturnValue = db.collections();
    expect(stub).to.be.calledWithExactly(undefined);
    const collections = await actualReturnValue;
    expect(collections).to.be.an('array');
    expect(collections.every(coll => coll instanceof LegacyCollection)).to.be.true;
  });

  it('support db.collections(options)', async () => {
    const returnValue = Promise.resolve([
      new mongodbDriver.Collection(db, 'a'),
      new mongodbDriver.Collection(db, 'b')
    ]);
    const stub = sinon.stub(mongodbDriver.Db.prototype, 'collections').returns(returnValue);
    const actualReturnValue = db.collections({ options: true });
    expect(stub).to.be.calledWithExactly({ options: true });
    const collections = await actualReturnValue;
    expect(collections).to.be.an('array');
    expect(collections.every(coll => coll instanceof LegacyCollection)).to.be.true;
  });

  it('support db.collections(callback)', done => {
    const returnValue = Promise.resolve([
      new mongodbDriver.Collection(db, 'a'),
      new mongodbDriver.Collection(db, 'b')
    ]);
    const stub = sinon.stub(mongodbDriver.Db.prototype, 'collections').returns(returnValue);
    db.collections((error, collections) => {
      try {
        expect(error).to.be.undefined;
        expect(collections).to.be.an('array');
        expect(collections.every(coll => coll instanceof LegacyCollection)).to.be.true;
        done();
      } catch (assertionError) {
        done(assertionError);
      }
    });
    expect(stub).to.be.calledWithExactly(undefined);
  });

  it('support db.collections(options, callback)', done => {
    const returnValue = Promise.resolve([
      new mongodbDriver.Collection(db, 'a'),
      new mongodbDriver.Collection(db, 'b')
    ]);
    const stub = sinon.stub(mongodbDriver.Db.prototype, 'collections').returns(returnValue);
    expect(db).to.have.property('collections').that.is.a('function');
    db.collections({ options: true }, (error, collections) => {
      try {
        expect(error).to.be.undefined;
        expect(collections).to.be.an('array');
        expect(collections.every(coll => coll instanceof LegacyCollection)).to.be.true;
        done();
      } catch (assertionError) {
        done(assertionError);
      }
    });
    expect(stub).to.be.calledWithExactly({ options: true });
  });
});
