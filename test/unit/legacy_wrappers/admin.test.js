'use strict';

const { MongoClient: LegacyMongoClient } = require('../../../src/index');
const { Admin } = require('mongodb');
const sinon = require('sinon');
const { expect } = require('chai');

describe('legacy_wrappers/admin.js', () => {
  let admin;
  let client;
  beforeEach(async function () {
    client = new LegacyMongoClient('mongodb://iLoveJs');
    admin = client.db().admin();
  });

  afterEach(async function () {
    sinon.restore();
    await client.close();
  });

  describe('addUser', () => {
    describe('callbacks', () => {
      it('should admin.addUser(username, callback)', done => {
        const stub = sinon.stub(Admin.prototype, 'addUser').returns(Promise.resolve({ ok: 1 }));
        admin.addUser('name', (error, result) => {
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

      it('should admin.addUser(username, password, callback)', done => {
        const stub = sinon.stub(Admin.prototype, 'addUser').returns(Promise.resolve({ ok: 1 }));
        admin.addUser('name', 'pass', (error, result) => {
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

      it('should admin.addUser(username, options, callback)', done => {
        const stub = sinon.stub(Admin.prototype, 'addUser').returns(Promise.resolve({ ok: 1 }));
        admin.addUser('name', { options: true }, (error, result) => {
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

      it('should admin.addUser(username, password, options, callback)', done => {
        const stub = sinon.stub(Admin.prototype, 'addUser').returns(Promise.resolve({ ok: 1 }));
        admin.addUser('name', 'pass', { options: true }, (error, result) => {
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
      it('should admin.addUser(username)', async () => {
        const stub = sinon.stub(Admin.prototype, 'addUser').returns(Promise.resolve({ ok: 1 }));
        const result = await admin.addUser('name');
        expect(result).to.deep.equal({ ok: 1 });
        expect(stub).to.have.been.calledWithExactly('name', undefined, undefined);
      });

      it('should admin.addUser(username, password)', async () => {
        const stub = sinon.stub(Admin.prototype, 'addUser').returns(Promise.resolve({ ok: 1 }));
        const result = await admin.addUser('name', 'pass');
        expect(result).to.deep.equal({ ok: 1 });
        expect(stub).to.have.been.calledWithExactly('name', 'pass', undefined);
      });

      it('should admin.addUser(username, options)', async () => {
        const stub = sinon.stub(Admin.prototype, 'addUser').returns(Promise.resolve({ ok: 1 }));
        const result = await admin.addUser('name', { options: true });
        expect(result).to.deep.equal({ ok: 1 });
        expect(stub).to.have.been.calledWithExactly('name', undefined, { options: true });
      });

      it('should admin.addUser(username, password, options)', async () => {
        const stub = sinon.stub(Admin.prototype, 'addUser').returns(Promise.resolve({ ok: 1 }));
        const result = await admin.addUser('name', 'pass', { options: true });
        expect(result).to.deep.equal({ ok: 1 });
        expect(stub).to.have.been.calledWithExactly('name', 'pass', { options: true });
      });
    });
  });
});
