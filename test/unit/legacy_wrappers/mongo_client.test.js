'use strict';

const { MongoClient, ChangeStream, ClientSession } = require('../../../src/index');
const mongodbDriver = require('mongodb');
const sinon = require('sinon');
const { expect } = require('chai');

const iLoveJs = 'mongodb://iLoveJavascript';

describe('legacy_wrappers/mongo_client.js', () => {
  let client;
  beforeEach(async function () {
    client = new MongoClient('mongodb://iLoveJs');
  });

  afterEach(async function () {
    sinon.restore();
    await client.close();
  });

  it('calling MongoClient.connect() returns promise', async () => {
    sinon.stub(mongodbDriver.MongoClient.prototype, 'connect').returns(Promise.resolve(2));
    expect(client).to.have.property('connect').that.is.a('function');
    const actualReturnValue = client.connect();
    expect(await actualReturnValue).to.be.instanceOf(MongoClient);
  });

  it('calling static MongoClient.connect(url) returns promise', async () => {
    sinon.stub(mongodbDriver.MongoClient.prototype, 'connect').returns(Promise.resolve(2));
    const actualReturnValue = MongoClient.connect(iLoveJs);
    expect(await actualReturnValue).to.be.instanceOf(MongoClient);
  });

  it('calling static MongoClient.connect(url, options) returns promise', async () => {
    sinon.stub(mongodbDriver.MongoClient.prototype, 'connect').returns(Promise.resolve(2));
    const actualReturnValue = MongoClient.connect(iLoveJs, { appName: 'my app!' });
    expect(await actualReturnValue).to.be.instanceOf(MongoClient);
  });

  it('calling static MongoClient.connect(url, callback)', done => {
    sinon.stub(mongodbDriver.MongoClient.prototype, 'connect').returns(Promise.resolve(2));
    MongoClient.connect(iLoveJs, (error, result) => {
      try {
        expect(error).to.be.undefined;
        expect(result).to.be.instanceOf(MongoClient);
        done();
      } catch (assertionError) {
        done(assertionError);
      }
    });
  });

  it('calling static MongoClient.connect(url, options, callback)', done => {
    const returnValue = Promise.resolve(new mongodbDriver.MongoClient(iLoveJs));
    sinon.stub(mongodbDriver.MongoClient.prototype, 'connect').returns(returnValue);
    MongoClient.connect(iLoveJs, { appName: 'my app!' }, (error, result) => {
      try {
        expect(error).to.be.undefined;
        expect(result).to.be.instanceOf(MongoClient);
        done();
      } catch (assertionError) {
        done(assertionError);
      }
    });
  });

  it('errors thrown from MongoClient constructor are passed to the promise for static connect', async () => {
    const makeClientIncorrectly = () => {
      try {
        return new MongoClient();
      } catch (error) {
        return error;
      }
    };
    const result = makeClientIncorrectly();
    expect(result).to.be.instanceOf(Error); // make sure constructor still throws
    const actualReturnValue = MongoClient.connect().catch(error => error);
    const errorFromConnect = await actualReturnValue;
    expect(errorFromConnect).to.be.instanceOf(Error);
    expect(errorFromConnect.name).to.deep.equal(makeClientIncorrectly().name);
  });

  it('should convert change stream to legacy version', () => {
    expect(client.watch()).to.be.instanceOf(ChangeStream);
  });

  it('should convert session to legacy version inside withSession', async () => {
    const spy = sinon.spy(mongodbDriver.MongoClient.prototype, 'withSession');
    const execCallback = async session => {
      expect(session).to.be.instanceOf(ClientSession);
    };

    await client.withSession(execCallback);
    const { args: args0 } = spy.getCall(0);
    expect(args0[0]).to.equal(undefined);
    expect(args0[1]).to.be.a('function');

    await client.withSession({ options: true }, execCallback);
    const { args: args1 } = spy.getCall(1);
    expect(args1[0]).to.deep.equal({ options: true });
    expect(args1[1]).to.be.a('function');
  });

  // Don't fix a misuse of the api in the wrapper
  it('should pass along undefined function if none is given', async () => {
    const spy = sinon.spy(mongodbDriver.MongoClient.prototype, 'withSession');
    const result = await client.withSession().catch(error => error);
    expect(result).to.be.instanceOf(Error);
    const { args: args0 } = spy.getCall(0);
    expect(args0[0]).to.equal(undefined);
    expect(args0[1]).to.be.a('function');
  });
});
