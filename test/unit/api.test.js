'use strict';

const sinon = require('sinon');
const { expect } = require('chai');

const mongodbDriver = require('mongodb');
const mongodbLegacy = require('../..');
const { MongoDBNamespace } = require('mongodb/lib/utils');
const { classNameToMethodList } = require('../tools/api');
const { byStrings, sorted } = require('../tools/utils');

// Dummy data to help with testing
const iLoveJs = 'mongodb://iLoveJavascript';
const client = new mongodbLegacy.MongoClient(iLoveJs);
const db = new mongodbLegacy.Db(client, 'animals');
const collection = new mongodbLegacy.Collection(db, 'pets');
const namespace = MongoDBNamespace.fromString('animals.pets');

// A map to helpers that can create instances of the overridden classes for testing
const OVERRIDDEN_CLASSES_GETTER = new Map([
  ['Admin', () => new mongodbLegacy.Admin(db)],
  ['AggregationCursor', () => new mongodbLegacy.AggregationCursor(client, namespace)],
  ['ChangeStream', () => new mongodbLegacy.ChangeStream(client)],
  ['ClientSession', () => client.startSession()],
  ['Collection', () => new mongodbLegacy.Collection(db, 'pets')],
  ['Db', () => new mongodbLegacy.Db(client, 'animals')],
  ['FindCursor', () => new mongodbLegacy.FindCursor(client, namespace)],
  ['GridFSBucket', () => new mongodbLegacy.GridFSBucket(db)],
  ['GridFSBucketWriteStream', () => new mongodbLegacy.GridFSBucket(db).openUploadStream('file')],
  ['ListCollectionsCursor', () => new mongodbLegacy.ListCollectionsCursor(db, {})],
  ['ListIndexesCursor', () => new mongodbLegacy.ListIndexesCursor(collection)],
  ['MongoClient', () => new mongodbLegacy.MongoClient(iLoveJs)],
  ['OrderedBulkOperation', () => collection.initializeOrderedBulkOp()],
  ['UnorderedBulkOperation', () => collection.initializeUnorderedBulkOp()]
]);

const classesWithGetters = sorted(OVERRIDDEN_CLASSES_GETTER.keys(), byStrings);
const listOfClasses = sorted(classNameToMethodList.keys(), byStrings);
expect(classesWithGetters).to.deep.equal(listOfClasses);

const cleanups = [];

/**
 * A generator that yields all programmatically-testable methods from the mongodb driver.  We do this in two steps:
 * First, we load the exhaustive list of all methods we need to test from api.js.  Second, we load the legacy driver
 * and use the methods loaded from api.js to find references to each class and method we need to test.  The
 * generator can then yield the references to the legacy classes, so that we can programmatically test them.  The
 * generator also yields all possible callback positions for each function.
 */
function* generateTests() {
  for (const [className, getInstance] of OVERRIDDEN_CLASSES_GETTER) {
    // For each of the overridden classes listed above
    /** @type {{ className: string; method: string; returnType: string; special?: string; }[]} */
    let methods = classNameToMethodList.get(className);
    if (methods == null) methods = [];

    for (const {
      method,
      special,
      possibleCallbackPositions,
      notAsync,
      changesPromise
    } of methods) {
      // for each of the methods on the overridden class
      if (typeof special === 'string' && special.length !== 0) {
        // If there is a special handling reason this method should be manually tested elsewhere
        continue;
      }

      if (notAsync === true) {
        // this method does not accept callbacks
        continue;
      }

      if (changesPromise === true) {
        // this method modifies the result, it needs access to a real instance in order to call toLegacy
        // this test logic does not simulate that
        continue;
      }

      expect(method).to.be.a('string');

      // Make the readable API name and construct an instance for testing
      const apiName = `${className}.${method}`;
      const instance = getInstance();

      if (className === 'ClientSession') {
        cleanups.push(() => instance.endSession());
      }
      if (className === 'MongoClient') {
        cleanups.push(() => instance.close());
      }
      if (className === 'GridFSBucketWriteStream') {
        cleanups.push(() => instance.end());
      }

      yield {
        className,
        method,
        instance,
        apiName,
        possibleCallbackPositions,
        makeStub: superPromise => {
          return sinon.stub(mongodbDriver[className].prototype, method).returns(superPromise);
        }
      };
    }
  }
}

describe('wrapper API', () => {
  after(async () => {
    for (const cleanup of cleanups) {
      await cleanup();
    }
  });

  afterEach(() => {
    sinon.restore();
  });

  for (const {
    apiName,
    instance,
    method,
    possibleCallbackPositions,
    makeStub
  } of generateTests()) {
    // For each callback position, we construct an array of arguments that contains the callback
    // at the specified position.  We can then test various scenarios (success callback, success promise, error callback and error promise)
    // for that given overload.

    expect(instance, apiName).to.have.property(method).that.is.a('function');
    const functionLength = instance[method].length;

    describe(`${apiName}()`, () => {
      // Use the callback positions manually defined, or use a default of [1] / [1,2] depending on function length
      const callbackPositions =
        possibleCallbackPositions != null
          ? possibleCallbackPositions
          : functionLength < 2
          ? [1]
          : [1, 2];

      for (const callbackPosition of callbackPositions) {
        // Make an array that is the same length as the function under test
        const args = Array.from({ length: functionLength }, (_, i) => i);
        // Place the callback at the position we want to see it in
        args[functionLength - callbackPosition] = 'callback';
        // truncate the array
        args.length = functionLength - (callbackPosition - 1);

        it(`should support calling ${apiName}(${args.join(', ')}(undefined, result))`, async () => {
          const superPromise = Promise.resolve({ message: 'success!' });
          makeStub(superPromise);

          expect(instance).to.have.property(method).that.is.a('function');

          const callback = sinon.spy();

          args[functionLength - callbackPosition] = callback;
          const actualReturnValue = instance[method](...args);

          expect(actualReturnValue).to.be.undefined;

          const returnValue = await superPromise.catch(error => error);
          expect(callback).to.have.been.calledOnce;
          const expectedArgs = callback.args[0];
          expect(expectedArgs).to.have.property('0', undefined);
          expect(expectedArgs).to.have.nested.property('[1].message', returnValue.message);

          const stubbedMethod = Object.getPrototypeOf(Object.getPrototypeOf(instance))[method];
          const argsPassedToDriver = args.slice(
            0,
            args.findIndex(arg => arg === callback)
          );
          expect(stubbedMethod).to.have.been.calledOnceWith(...argsPassedToDriver);
        });

        it(`should support calling ${apiName}(${args.join(', ')}(error))`, async () => {
          const superPromise = Promise.reject(new Error('error!'));
          makeStub(superPromise);

          expect(instance).to.have.property(method).that.is.a('function');

          const callback = sinon.spy();

          args[functionLength - callbackPosition] = callback;
          const actualReturnValue = instance[method](...args);

          expect(actualReturnValue).to.be.undefined;

          const returnValue = await superPromise.catch(error => error);
          expect(callback).to.have.been.calledOnce;
          const expectedArgs = callback.args[0];
          expect(expectedArgs).to.have.nested.property('[0].message', returnValue.message);

          const stubbedMethod = Object.getPrototypeOf(Object.getPrototypeOf(instance))[method];
          const argsPassedToDriver = args.slice(
            0,
            args.findIndex(arg => arg === callback)
          );
          expect(stubbedMethod).to.have.been.calledOnceWith(...argsPassedToDriver);
        });
      }

      const args = Array.from({ length: functionLength - 1 }, (_, i) => i);
      const argsString = args.join(', ');

      it(`should support calling ${apiName}(${argsString}) returns resolved Promise`, async () => {
        // should have a message property to make equality checking consistent
        const superPromise = Promise.resolve({ message: 'success!' });
        makeStub(superPromise);

        expect(instance).to.have.property(method).that.is.a('function');

        const actualReturnValue = instance[method](...args);

        // should return the same promise the driver returns
        expect(actualReturnValue).to.equal(superPromise);

        // should have a message property to make equality checking consistent
        await superPromise;
        const result = await actualReturnValue.catch(error => error);

        expect(result).to.have.property('message', 'success!');

        const stubbedMethod = Object.getPrototypeOf(Object.getPrototypeOf(instance))[method];
        expect(stubbedMethod).to.have.been.calledOnceWithExactly(...args);
      });

      it(`should support calling ${apiName}(${argsString}) returns rejected Promise`, async () => {
        const superPromise = Promise.reject(new Error('error!'));
        makeStub(superPromise);

        expect(instance).to.have.property(method).that.is.a('function');

        const actualReturnValue = instance[method](...args);

        // should return the same promise the driver returns
        expect(actualReturnValue).to.equal(superPromise);

        // awaiting triggers the callback to be called
        await superPromise.catch(error => error);
        const result = await actualReturnValue.catch(error => error);

        expect(result).to.have.property('message', 'error!');

        const stubbedMethod = Object.getPrototypeOf(Object.getPrototypeOf(instance))[method];
        expect(stubbedMethod).to.have.been.calledOnceWithExactly(...args);
      });
    });
  }
});
