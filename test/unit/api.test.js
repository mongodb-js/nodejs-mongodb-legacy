'use strict';

const sinon = require('sinon');
const { expect } = require('chai');

const mongodbDriver = require('mongodb');
const mongodbLegacy = require('../..');
const { MongoDBNamespace } = require('mongodb/lib/utils');
const { classNameToMethodList } = require('../tools/api');
const { byStrings, sorted, runMicroTask } = require('../tools/utils');

// Dummy data to help with testing
const iLoveJs = 'mongodb://iLoveJavascript';
const client = new mongodbLegacy.MongoClient(iLoveJs);
const db = new mongodbLegacy.Db(client, 'animals');
const collection = new mongodbLegacy.Collection(db, 'pets', {});
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
    expect(instance, apiName).to.have.property(method).that.is.a('function');
    const functionLength = instance[method].length;

    describe(`${apiName}()`, () => {
      const resolveSuite = [];
      const rejectsSuite = [];
      // Use the callback positions manually defined, or use a default of [1] / [1,2] depending on function length
      const callbackPositions =
        possibleCallbackPositions != null
          ? possibleCallbackPositions
          : functionLength < 2
            ? [1]
            : [1, 2];

      for (const argumentDecrement of callbackPositions) {
        // For each callback position, we construct an array of arguments that contains the callback
        // at the specified position.  We can then test various scenarios (success callback, success promise, error callback and error promise)
        // for that given overload.

        // Make an array that is the same length as the function under test
        const args = Array.from({ length: functionLength }, (_, i) => i);
        const callbackPosition = functionLength - argumentDecrement;
        // Place the callback at the position we want to see it in
        args[callbackPosition] = 'callback';
        // truncate the array
        const argsPassedToDriver = args.slice(0, callbackPosition);

        resolveSuite.push(() =>
          describe(`and ${apiName} is called  with (${args.join(', ')})`, () => {
            let superPromise;
            let actualReturnValue;
            let callback;
            let stubbedMethod;
            const expectedResult = { message: 'success!' };

            before('setup success stub for callback case', function () {
              superPromise = Promise.resolve(expectedResult);
              stubbedMethod = makeStub(superPromise);
              callback = sinon.spy();
              args[callbackPosition] = callback;
              actualReturnValue = instance[method](...args);
            });

            it('should return void', () => expect(actualReturnValue).to.be.undefined);

            it('should call the callback with undefined error and successful result', async () => {
              await runMicroTask();
              expect(callback).to.have.been.calledOnceWithExactly(undefined, expectedResult);
            });

            it(`should pass only (${argsPassedToDriver.join(', ')}) to the driver api`, () => {
              expect(stubbedMethod).to.have.been.calledOnceWith(...argsPassedToDriver);
            });
          })
        );

        rejectsSuite.push(() =>
          describe(`and ${apiName} is called  with (${args.join(', ')})`, () => {
            let superPromise;
            let actualReturnValue;
            let callback;
            let stubbedMethod;
            let actualError;
            const expectedError = new Error('error!');

            before('setup error stub for callback case', function () {
              superPromise = Promise.reject(expectedError);
              stubbedMethod = makeStub(superPromise);
              callback = sinon.spy();
              args[callbackPosition] = callback;
              actualReturnValue = instance[method](...args);
            });

            beforeEach(async function () {
              actualError = await superPromise.catch(error => error);
              expect(actualError).to.be.instanceOf(Error); // meta check
            });

            it('should return void', () => expect(actualReturnValue).to.be.undefined);

            it('should call the callback with error', () => {
              expect(callback).to.have.been.calledOnceWithExactly(actualError);
            });

            it(`should pass only (${argsPassedToDriver.join(', ')}) to the driver api`, () => {
              expect(stubbedMethod).to.have.been.calledOnceWith(...argsPassedToDriver);
            });
          })
        );
      }

      const args = Array.from({ length: functionLength - 1 }, (_, i) => i);

      resolveSuite.push(() =>
        describe(`and ${apiName} is called  with (${args.join(', ')})`, () => {
          let superPromise;
          let actualReturnValue;
          let stubbedMethod;
          let expectedResult = { message: 'success!' };

          before('setup success stub for promise case', function () {
            superPromise = Promise.resolve(expectedResult);
            stubbedMethod = makeStub(superPromise);
            actualReturnValue = instance[method](...args);
          });

          it('should return the same promise the driver returns', () => {
            expect(actualReturnValue).to.equal(superPromise);
          });

          it('should return a resolved promise', async () => {
            const actualResult = await actualReturnValue;
            expect(actualResult).to.equal(expectedResult);
          });

          it(`should pass only (${args.join(', ')}) to the driver api`, () => {
            expect(stubbedMethod).to.have.been.calledOnceWithExactly(...args);
          });
        })
      );

      rejectsSuite.push(() =>
        describe(`and ${apiName} is called  with (${args.join(', ')})`, () => {
          let superPromise;
          let actualReturnValue;
          let stubbedMethod;
          let actualError;
          const expectedError = new Error('error!');

          before('setup error stub for promise case', function () {
            superPromise = Promise.reject(expectedError);
            stubbedMethod = makeStub(superPromise);
            actualReturnValue = instance[method](...args);
          });

          it('should return the same promise the driver returns', async () => {
            expect(actualReturnValue).to.equal(superPromise);
          });

          it('should reject with the same error the driver threw', async () => {
            actualError = await actualReturnValue.catch(error => error);
            expect(actualError).to.equal(expectedError);
          });

          it(`should pass only (${args.join(', ')}) to the driver api`, () => {
            expect(stubbedMethod).to.have.been.calledOnceWithExactly(...args);
          });
        })
      );

      describe('when the driver api resolves', () => {
        for (const makeSuite of resolveSuite) {
          makeSuite();
        }
      });
      describe('when the driver api rejects', () => {
        for (const makeSuite of rejectsSuite) {
          makeSuite();
        }
      });
    });
  }
});
