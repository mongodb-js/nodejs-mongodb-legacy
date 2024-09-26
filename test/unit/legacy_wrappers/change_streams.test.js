'use strict';

const { MongoClient: LegacyMongoClient } = require('../../../src/index');
const mongodbDriver = require('mongodb');
const sinon = require('sinon');
const { expect } = require('chai');

const iLoveJs = 'mongodb://iLoveJavascript';

describe('legacy_wrappers/change_streams.js', () => {
  let client;
  let changeStream;
  beforeEach(async function () {
    client = new LegacyMongoClient(iLoveJs);
    changeStream = client.db('test').collection('test').watch();
  });

  afterEach(async function () {
    sinon.restore();
    await client.close();
  });

  context('close', function () {
    it('correctly handles parameters when options are provided', function () {
      const spy = sinon.spy(mongodbDriver.ChangeStream.prototype, 'close');
      const opts = { timeoutMS: 100 };
      changeStream.close(opts, () => {});
      expect(spy).to.be.calledWithExactly(opts);
    });
    it('correctly handles parameters when options are not provided', function () {
      const spy = sinon.spy(mongodbDriver.ChangeStream.prototype, 'close');
      changeStream.close(() => {});
      expect(spy).to.be.calledWithExactly(undefined);
    });
  });
});
