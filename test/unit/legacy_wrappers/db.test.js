'use strict';

const {
  MongoClient,
  ListCollectionsCursor,
  ChangeStream,
  AggregationCursor,
  Collection
} = require('../../../src/index');
const mongodbDriver = require('mongodb');
const { Db } = require('mongodb');
const sinon = require('sinon');
const { expect } = require('chai');

describe('legacy_wrappers/db.js', () => {
  let db;
  let client;
  beforeEach(async function () {
    client = new MongoClient('mongodb://iLoveJs');
    db = client.db();
  });

  afterEach(async function () {
    sinon.restore();
    await client.close();
  });

  it('should return legacy listCollections cursor', () => {
    expect(db.listCollections()).to.be.instanceOf(ListCollectionsCursor);
  });

  it('should return legacy ChangeStream', () => {
    expect(db.watch()).to.be.instanceOf(ChangeStream);
  });

  it('should return legacy ChangeStream', () => {
    expect(db.aggregate()).to.be.instanceOf(AggregationCursor);
  });

  describe('addUser', () => {
    describe('callbacks', () => {
      it('should db.addUser(username, callback)', done => {
        const stub = sinon.stub(Db.prototype, 'addUser').returns(Promise.resolve({ ok: 1 }));
        db.addUser('name', (error, result) => {
          try {
            expect(error).to.be.undefined;
            expect(result).to.deep.equal({ ok: 1 });
            done();
          } catch (assertionError) {
            done(assertionError);
          }
        });
        expect(stub).to.have.been.calledWithExactly('name', undefined, undefined);
      });

      it('should db.addUser(username, password, callback)', done => {
        const stub = sinon.stub(Db.prototype, 'addUser').returns(Promise.resolve({ ok: 1 }));
        db.addUser('name', 'pass', (error, result) => {
          try {
            expect(error).to.be.undefined;
            expect(result).to.deep.equal({ ok: 1 });
            done();
          } catch (assertionError) {
            done(assertionError);
          }
        });
        expect(stub).to.have.been.calledWithExactly('name', 'pass', undefined);
      });

      it('should db.addUser(username, options, callback)', done => {
        const stub = sinon.stub(Db.prototype, 'addUser').returns(Promise.resolve({ ok: 1 }));
        db.addUser('name', { options: true }, (error, result) => {
          try {
            expect(error).to.be.undefined;
            expect(result).to.deep.equal({ ok: 1 });
            done();
          } catch (assertionError) {
            done(assertionError);
          }
        });
        expect(stub).to.have.been.calledWithExactly('name', undefined, { options: true });
      });

      it('should db.addUser(username, password, options, callback)', done => {
        const stub = sinon.stub(Db.prototype, 'addUser').returns(Promise.resolve({ ok: 1 }));
        db.addUser('name', 'pass', { options: true }, (error, result) => {
          try {
            expect(error).to.be.undefined;
            expect(result).to.deep.equal({ ok: 1 });
            done();
          } catch (assertionError) {
            done(assertionError);
          }
        });
        expect(stub).to.have.been.calledWithExactly('name', 'pass', { options: true });
      });
    });

    describe('promises', () => {
      it('should db.addUser(username)', async () => {
        const stub = sinon.stub(Db.prototype, 'addUser').returns(Promise.resolve({ ok: 1 }));
        const result = await db.addUser('name');
        expect(result).to.deep.equal({ ok: 1 });
        expect(stub).to.have.been.calledWithExactly('name', undefined, undefined);
      });

      it('should db.addUser(username, password)', async () => {
        const stub = sinon.stub(Db.prototype, 'addUser').returns(Promise.resolve({ ok: 1 }));
        const result = await db.addUser('name', 'pass');
        expect(result).to.deep.equal({ ok: 1 });
        expect(stub).to.have.been.calledWithExactly('name', 'pass', undefined);
      });

      it('should db.addUser(username, options)', async () => {
        const stub = sinon.stub(Db.prototype, 'addUser').returns(Promise.resolve({ ok: 1 }));
        const result = await db.addUser('name', { options: true });
        expect(result).to.deep.equal({ ok: 1 });
        expect(stub).to.have.been.calledWithExactly('name', undefined, { options: true });
      });

      it('should db.addUser(username, password, options)', async () => {
        const stub = sinon.stub(Db.prototype, 'addUser').returns(Promise.resolve({ ok: 1 }));
        const result = await db.addUser('name', 'pass', { options: true });
        expect(result).to.deep.equal({ ok: 1 });
        expect(stub).to.have.been.calledWithExactly('name', 'pass', { options: true });
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
    expect(await actualReturnValue).to.be.instanceOf(Collection);
    expect(stub).to.be.calledWithExactly('a', undefined);
  });

  it('support db.createCollection(name, options)', async () => {
    const returnValue = Promise.resolve(new mongodbDriver.Collection(db, 'a'));
    const stub = sinon.stub(mongodbDriver.Db.prototype, 'createCollection').returns(returnValue);
    const actualReturnValue = db.createCollection('a', { options: true });
    expect(await actualReturnValue).to.be.instanceOf(Collection);
    expect(stub).to.be.calledWithExactly('a', { options: true });
  });

  it('support db.createCollection(name, callback)', done => {
    const returnValue = Promise.resolve(new mongodbDriver.Collection(db, 'a'));
    const stub = sinon.stub(mongodbDriver.Db.prototype, 'createCollection').returns(returnValue);
    db.createCollection('a', (error, collection) => {
      try {
        expect(error).to.be.undefined;
        expect(collection).to.be.instanceOf(Collection);
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
        expect(collection).to.be.instanceOf(Collection);
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
    expect(collections.every(coll => coll instanceof Collection)).to.be.true;
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
    expect(collections.every(coll => coll instanceof Collection)).to.be.true;
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
        expect(collections.every(coll => coll instanceof Collection)).to.be.true;
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
        expect(collections.every(coll => coll instanceof Collection)).to.be.true;
        done();
      } catch (assertionError) {
        done(assertionError);
      }
    });
    expect(stub).to.be.calledWithExactly({ options: true });
  });
});
