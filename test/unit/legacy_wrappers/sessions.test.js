'use strict';

const { MongoClient, ClientSession: LegacyClientSession } = require('../../../src/index');
const { ClientSession: DriverClientSession } = require('mongodb');
const { expect } = require('chai');
const sinon = require('sinon');

describe('legacy_wrappers/session.js', () => {
  let session;
  let client;
  beforeEach(async function () {
    client = new MongoClient('mongodb://iLoveJs');
    session = client.startSession();
  });

  afterEach(async function () {
    sinon.restore();
    await client.close();
  });

  it('should support withTransaction', async () => {
    expect(session).to.have.property('withTransaction').to.be.a('function');
    let sessionPassedToCb;
    const res = session.withTransaction(async sessionArg => {
      sessionPassedToCb = sessionArg;
    });
    expect(sessionPassedToCb).to.be.instanceOf(LegacyClientSession);
    expect(res).to.be.instanceOf(Promise);
    await res;
  });

  it('should support session.abortTransaction(callback)', done => {
    const stub = sinon
      .stub(DriverClientSession.prototype, 'abortTransaction')
      .returns(Promise.resolve({ ok: 1 }));
    session.abortTransaction((error, result) => {
      try {
        expect(error).to.be.undefined;
        expect(result).to.deep.equal({ ok: 1 });
        done();
      } catch (assertionError) {
        done(assertionError);
      }
    });
    expect(stub).to.be.calledWithExactly();
  });

  it('should support session.abortTransaction()', async () => {
    const stub = sinon
      .stub(DriverClientSession.prototype, 'abortTransaction')
      .returns(Promise.resolve({ ok: 1 }));
    const result = await session.abortTransaction();
    expect(result).to.deep.equal({ ok: 1 });
    expect(stub).to.be.calledWithExactly();
  });

  it('should support session.commitTransaction(callback)', done => {
    const stub = sinon
      .stub(DriverClientSession.prototype, 'commitTransaction')
      .returns(Promise.resolve({ ok: 1 }));
    session.commitTransaction((error, result) => {
      try {
        expect(error).to.be.undefined;
        expect(result).to.deep.equal({ ok: 1 });
        done();
      } catch (assertionError) {
        done(assertionError);
      }
    });
    expect(stub).to.be.calledWithExactly();
  });

  it('should support session.commitTransaction()', async () => {
    const stub = sinon
      .stub(DriverClientSession.prototype, 'commitTransaction')
      .returns(Promise.resolve({ ok: 1 }));
    const result = await session.commitTransaction();
    expect(result).to.deep.equal({ ok: 1 });
    expect(stub).to.be.calledWithExactly();
  });

  it('should support session.endSession(callback)', done => {
    const stub = sinon
      .stub(DriverClientSession.prototype, 'endSession')
      .returns(Promise.resolve({ ok: 1 }));
    session.endSession((error, result) => {
      try {
        expect(error).to.be.undefined;
        expect(result).to.deep.equal({ ok: 1 });
        done();
      } catch (assertionError) {
        done(assertionError);
      }
    });
    expect(stub).to.be.calledWithExactly(undefined);
  });

  it('should support session.endSession(options, callback)', done => {
    const stub = sinon
      .stub(DriverClientSession.prototype, 'endSession')
      .returns(Promise.resolve({ ok: 1 }));
    session.endSession({ options: true }, (error, result) => {
      try {
        expect(error).to.be.undefined;
        expect(result).to.deep.equal({ ok: 1 });
        done();
      } catch (assertionError) {
        done(assertionError);
      }
    });
    expect(stub).to.be.calledWithExactly({ options: true });
  });

  it('should support session.endSession()', async () => {
    const stub = sinon
      .stub(DriverClientSession.prototype, 'endSession')
      .returns(Promise.resolve({ ok: 1 }));
    const result = await session.endSession();
    expect(result).to.deep.equal({ ok: 1 });
    expect(stub).to.be.calledWithExactly(undefined);
  });

  it('should support session.endSession(options)', async () => {
    const stub = sinon
      .stub(DriverClientSession.prototype, 'endSession')
      .returns(Promise.resolve({ ok: 1 }));
    const result = await session.endSession({ options: true });
    expect(result).to.deep.equal({ ok: 1 });
    expect(stub).to.be.calledWithExactly({ options: true });
  });
});
