'use strict';

const {
  MongoClient: LegacyMongoClient,
  ClientSession: LegacyClientSession
} = require('../../../src/index');
const { expect } = require('chai');
const sinon = require('sinon');

describe('legacy_wrappers/session.js', () => {
  let session;
  let client;
  beforeEach(async function () {
    client = new LegacyMongoClient('mongodb://iLoveJs');
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
});
