'use strict';

const {
  MongoClient: LegacyMongoClient,
  ChangeStream: LegacyChangeStream,
  ClientSession: LegacyClientSession
} = require('../../../src/index');
const mongodbDriver = require('mongodb');
const sinon = require('sinon');
const { expect } = require('chai');

const iLoveJs = 'mongodb://iLoveJavascript';

const currentLegacyVersion = require('../../../package.json').version;

describe('legacy_wrappers/mongo_client.js', () => {
  let client;
  beforeEach(async function () {
    client = new LegacyMongoClient('mongodb://iLoveJs');
  });

  afterEach(async function () {
    sinon.restore();
    await client.close();
  });

  describe('setting client metadata', () => {
    describe('when no driverInfo is passed to MongoClient()', () => {
      it('should set mongodb-legacy to the client metadata', () => {
        const client = new LegacyMongoClient(iLoveJs);
        expect(client.options.metadata).to.have.nested.property(
          'driver.name',
          'nodejs|mongodb-legacy'
        );
        expect(client.options.metadata)
          .to.have.property('version')
          .that.includes(currentLegacyVersion);
      });
    });

    describe('when driverInfo is passed to MongoClient()', () => {
      it('should prepend mongodb-legacy to user passed driverInfo.name', () => {
        const client = new LegacyMongoClient(iLoveJs, { driverInfo: { name: 'mongoose' } });
        expect(client.options.metadata).to.have.nested.property(
          'driver.name',
          'nodejs|mongodb-legacy|mongoose'
        );
        expect(client.options.metadata)
          .to.have.property('version')
          .that.includes(currentLegacyVersion);
      });

      it('should prepend mongodb-legacy to user passed driverInfo.name and legacy version number to user passed driverInfo.version', () => {
        const client = new LegacyMongoClient(iLoveJs, {
          driverInfo: { name: 'mongoose', version: '99.99.99' }
        });
        expect(client.options.metadata)
          .to.have.nested.property('driver.name')
          .that.equals('nodejs|mongodb-legacy|mongoose');
        expect(client.options.metadata)
          .to.have.property('version')
          .that.includes(`${currentLegacyVersion}|99.99.99`);
      });

      it('should prepend legacy version number to user passed driverInfo.version', () => {
        const client = new LegacyMongoClient(iLoveJs, {
          driverInfo: { version: '99.99.99' }
        });
        expect(client.options.metadata)
          .to.have.nested.property('driver.name')
          .that.equals('nodejs|mongodb-legacy');
        expect(client.options.metadata)
          .to.have.property('version')
          .that.includes(`${currentLegacyVersion}|99.99.99`);
      });
    });
  });

  it('calling MongoClient.connect() returns promise', async () => {
    sinon.stub(mongodbDriver.MongoClient.prototype, 'connect').returns(Promise.resolve(2));
    expect(client).to.have.property('connect').that.is.a('function');
    const actualReturnValue = client.connect();
    expect(await actualReturnValue).to.be.instanceOf(LegacyMongoClient);
  });

  it('calling static MongoClient.connect(url) returns promise', async () => {
    sinon.stub(mongodbDriver.MongoClient.prototype, 'connect').returns(Promise.resolve(2));
    const actualReturnValue = LegacyMongoClient.connect(iLoveJs);
    expect(await actualReturnValue).to.be.instanceOf(LegacyMongoClient);
  });

  it('calling static MongoClient.connect(url, options) returns promise', async () => {
    sinon.stub(mongodbDriver.MongoClient.prototype, 'connect').returns(Promise.resolve(2));
    const actualReturnValue = LegacyMongoClient.connect(iLoveJs, { appName: 'my app!' });
    expect(await actualReturnValue).to.be.instanceOf(LegacyMongoClient);
  });

  it('calling static MongoClient.connect(url, callback)', done => {
    sinon.stub(mongodbDriver.MongoClient.prototype, 'connect').returns(Promise.resolve(2));
    LegacyMongoClient.connect(iLoveJs, (error, result) => {
      try {
        expect(error).to.be.undefined;
        expect(result).to.be.instanceOf(LegacyMongoClient);
        done();
      } catch (assertionError) {
        done(assertionError);
      }
    });
  });

  it('calling static MongoClient.connect(url, options, callback)', done => {
    const returnValue = Promise.resolve(new mongodbDriver.MongoClient(iLoveJs));
    sinon.stub(mongodbDriver.MongoClient.prototype, 'connect').returns(returnValue);
    LegacyMongoClient.connect(iLoveJs, { appName: 'my app!' }, (error, result) => {
      try {
        expect(error).to.be.undefined;
        expect(result).to.be.instanceOf(LegacyMongoClient);
        done();
      } catch (assertionError) {
        done(assertionError);
      }
    });
  });

  it('errors thrown from MongoClient constructor are passed to the promise for static connect', async () => {
    const makeClientIncorrectly = () => {
      try {
        return new LegacyMongoClient();
      } catch (error) {
        return error;
      }
    };
    const result = makeClientIncorrectly();
    expect(result).to.be.instanceOf(Error); // make sure constructor still throws
    const actualReturnValue = LegacyMongoClient.connect().catch(error => error);
    const errorFromConnect = await actualReturnValue;
    expect(errorFromConnect).to.be.instanceOf(Error);
    expect(errorFromConnect.name).to.deep.equal(makeClientIncorrectly().name);
  });

  it('should convert change stream to legacy version', () => {
    expect(client.watch()).to.be.instanceOf(LegacyChangeStream);
  });

  it('should convert session to legacy version inside withSession', async () => {
    const spy = sinon.spy(mongodbDriver.MongoClient.prototype, 'withSession');
    const execCallback = async session => {
      expect(session).to.be.instanceOf(LegacyClientSession);
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
  it('should always pass two arguments to the driver where the second is always a function', async () => {
    const spy = sinon.spy(mongodbDriver.MongoClient.prototype, 'withSession');
    const result = await client.withSession().catch(error => error);
    expect(result).to.be.instanceOf(Error);
    const { args } = spy.getCall(0);
    expect(args).to.have.lengthOf(2);
    expect(args[0]).to.equal(undefined);
    expect(args[1]).to.be.a('function');
  });
});
