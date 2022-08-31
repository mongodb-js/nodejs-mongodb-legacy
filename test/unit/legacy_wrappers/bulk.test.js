'use strict';

const { MongoClient: LegacyMongoClient } = require('../../../src/index');
const sinon = require('sinon');
const { expect } = require('chai');
const { BulkOperationBase } = require('mongodb/lib/bulk/common');

describe('legacy_wrappers/bulk.js', () => {
  let collection;
  let client;
  let stub;

  beforeEach(async function () {
    client = new LegacyMongoClient('mongodb://iLoveJs');
    // This is the minimal topology shim needed to get bulk apis to work
    client.topology = {
      s: { options: {} },
      lastHello() {
        return null;
      }
    };
    collection = client.db().collection('a');
    stub = sinon.stub(BulkOperationBase.prototype, 'execute').returns(Promise.resolve({ ok: 1 }));
  });

  afterEach(async function () {
    sinon.restore();
    client.topology = null;
    await client.close();
  });

  describe('LegacyUnorderedBulkOperation', () => {
    describe('callbacks', () => {
      it('should bulk.execute(callback)', done => {
        const bulk = collection.initializeUnorderedBulkOp();
        bulk.insert({ a: 1 });
        bulk.execute((error, result) => {
          try {
            expect(error).to.be.undefined;
            expect(result).to.deep.equal({ ok: 1 });
            done();
          } catch (assertionError) {
            done(assertionError);
          }
        });
        expect(stub).to.have.been.calledWithExactly(undefined);
      });

      it('should bulk.execute(options, callback)', done => {
        const bulk = collection.initializeUnorderedBulkOp();
        bulk.insert({ a: 1 });
        bulk.execute({ options: true }, (error, result) => {
          try {
            expect(error).to.be.undefined;
            expect(result).to.deep.equal({ ok: 1 });
            done();
          } catch (assertionError) {
            done(assertionError);
          }
        });
        expect(stub).to.have.been.calledWithExactly({ options: true });
      });
    });

    describe('promises', () => {
      it('should bulk.execute()', async () => {
        const bulk = collection.initializeUnorderedBulkOp();
        const result = await bulk.execute();
        expect(result).to.deep.equal({ ok: 1 });
        expect(stub).to.have.been.calledWithExactly(undefined);
      });

      it('should bulk.execute(options)', async () => {
        const bulk = collection.initializeUnorderedBulkOp();
        const result = await bulk.execute({ options: true });
        expect(result).to.deep.equal({ ok: 1 });
        expect(stub).to.have.been.calledWithExactly({ options: true });
      });
    });
  });

  describe('LegacyOrderedBulkOperation', () => {
    describe('callbacks', () => {
      it('should bulk.execute(callback)', done => {
        const bulk = collection.initializeOrderedBulkOp();
        bulk.insert({ a: 1 });
        bulk.execute((error, result) => {
          try {
            expect(error).to.be.undefined;
            expect(result).to.deep.equal({ ok: 1 });
            done();
          } catch (assertionError) {
            done(assertionError);
          }
        });
        expect(stub).to.have.been.calledWithExactly(undefined);
      });

      it('should bulk.execute(options, callback)', done => {
        const bulk = collection.initializeOrderedBulkOp();
        bulk.insert({ a: 1 });
        bulk.execute({ options: true }, (error, result) => {
          try {
            expect(error).to.be.undefined;
            expect(result).to.deep.equal({ ok: 1 });
            done();
          } catch (assertionError) {
            done(assertionError);
          }
        });
        expect(stub).to.have.been.calledWithExactly({ options: true });
      });
    });

    describe('promises', () => {
      it('should bulk.execute()', async () => {
        const bulk = collection.initializeOrderedBulkOp();
        const result = await bulk.execute();
        expect(result).to.deep.equal({ ok: 1 });
        expect(stub).to.have.been.calledWithExactly(undefined);
      });

      it('should bulk.execute(options)', async () => {
        const bulk = collection.initializeOrderedBulkOp();
        const result = await bulk.execute({ options: true });
        expect(result).to.deep.equal({ ok: 1 });
        expect(stub).to.have.been.calledWithExactly({ options: true });
      });
    });
  });
});
