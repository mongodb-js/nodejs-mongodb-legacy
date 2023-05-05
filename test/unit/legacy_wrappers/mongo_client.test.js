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

  describe('calling the constructor with invalid types', () => {
    it('should not throw when passing a non-object type as the options', () => {
      // The driver ignores non-object types in the options arg position
      // so this confirms our logic for adding metadata or any other handling
      // does not introduce an error for non-object types
      expect(() => {
        new LegacyMongoClient(iLoveJs, true);
      }).to.not.throw();
    });
  });

  describe('setting client metadata', () => {
    it('does not mutate the input options', () => {
      expect(() => {
        new LegacyMongoClient(iLoveJs, Object.freeze({}));
      }).to.not.throw();
    });

    it('does not mutate the input options.driverInfo', () => {
      expect(() => {
        new LegacyMongoClient(iLoveJs, Object.freeze({ driverInfo: Object.freeze({}) }));
      }).to.not.throw();
    });

    describe('when driverInfo.name is provided', () => {
      const client = new LegacyMongoClient(iLoveJs, { driverInfo: { name: 'mongoose' } });

      it('should prepend mongodb-legacy to user passed driverInfo.name', () =>
        expect(client.options.metadata).to.have.nested.property(
          'driver.name',
          'nodejs|mongodb-legacy|mongoose'
        ));

      it('should include version in package.json in client metadata', () => {
        if (client.options.metadata.version == null) {
          // Driver 5.3.0 corrected the position of version https://github.com/mongodb/node-mongodb-native/pull/3626
          expect(client.options.metadata)
            .to.have.nested.property('driver.version')
            .that.includes(currentLegacyVersion);
          return;
        }
        expect(client.options.metadata)
          .to.have.property('version')
          .that.includes(currentLegacyVersion);
      });
    });

    describe('when driverInfo.name is provided and driverInfo.version is provided', () => {
      const client = new LegacyMongoClient(iLoveJs, {
        driverInfo: { name: 'mongoose', version: '99.99.99' }
      });

      it('should prepend mongodb-legacy to user passed driverInfo.name', () =>
        expect(client.options.metadata)
          .to.have.nested.property('driver.name')
          .that.equals('nodejs|mongodb-legacy|mongoose'));

      it('should prepend version in package.json to user driverInfo.version', () => {
        if (client.options.metadata.version == null) {
          // Driver 5.3.0 corrected the position of version https://github.com/mongodb/node-mongodb-native/pull/3626
          expect(client.options.metadata)
            .to.have.nested.property('driver.version')
            .that.includes(`${currentLegacyVersion}|99.99.99`);
          return;
        }
        expect(client.options.metadata)
          .to.have.property('version')
          .that.includes(`${currentLegacyVersion}|99.99.99`);
      });
    });

    describe('when driverInfo.version is provided', () => {
      const client = new LegacyMongoClient(iLoveJs, {
        driverInfo: { version: '99.99.99' }
      });

      it('should include mongodb-legacy in client metadata', () =>
        expect(client.options.metadata)
          .to.have.nested.property('driver.name')
          .that.equals('nodejs|mongodb-legacy'));

      it('should prepend version in package.json to user driverInfo.version', () => {
        if (client.options.metadata.version == null) {
          // Driver 5.3.0 corrected the position of version https://github.com/mongodb/node-mongodb-native/pull/3626
          expect(client.options.metadata)
            .to.have.nested.property('driver.version')
            .that.includes(`${currentLegacyVersion}|99.99.99`);
          return;
        }
        expect(client.options.metadata)
          .to.have.property('version')
          .that.includes(`${currentLegacyVersion}|99.99.99`);
      });
    });

    describe('when driverInfo is not provided', () => {
      const client = new LegacyMongoClient(iLoveJs);

      it('should include mongodb-legacy in client metadata', () =>
        expect(client.options.metadata)
          .to.have.nested.property('driver.name')
          .that.equals('nodejs|mongodb-legacy'));

      it('should include version in package.json in client metadata', () => {
        if (client.options.metadata.version == null) {
          // Driver 5.3.0 corrected the position of version https://github.com/mongodb/node-mongodb-native/pull/3626
          expect(client.options.metadata)
            .to.have.nested.property('driver.version')
            .that.includes(currentLegacyVersion);
          return;
        }
        expect(client.options.metadata)
          .to.have.property('version')
          .that.includes(currentLegacyVersion);
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
