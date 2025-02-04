'use strict';

const sinon = require('sinon');
const { expect } = require('chai');

const mongodbDriver = require('mongodb');
const mongodbLegacy = require('../..');
const { MongoDBNamespace } = require('mongodb/lib/utils');
const { unitTestableAPI } = require('../tools/api');
const { runMicroTask } = require('../tools/utils');

describe('wrapper API', () => {
  for (const {
    className,
    method,
    possibleCallbackPositions,
    functionLength,
    apiName = `${className}.${method}`
  } of unitTestableAPI) {
    describe(`${apiName}()`, () => {
      let instance, client, db, collection, namespace;

      beforeEach(function () {
        client = new mongodbLegacy.MongoClient('mongodb://iLoveJavascript');
        db = new mongodbLegacy.Db(client, 'animals');
        collection = new mongodbLegacy.Collection(db, 'pets', {});
        namespace = MongoDBNamespace.fromString('animals.pets');

        client.connect().catch(_e => {});

        instance = makeInstance(
          {
            client,
            db,
            namespace,
            collection
          },
          className
        );
      });

      afterEach(async function () {
        sinon.restore();

        if (className === 'ClientSession' && method !== 'endSession') {
          await instance.endSession();
        }
        if (className === 'MongoClient' && method !== 'close') {
          await instance.close();
        }
        if (className === 'GridFSBucketWriteStream' && method !== 'end') {
          await instance.end();
        }
        await client.close();
        sinon.restore();
      });
      const resolveSuite = [];
      const rejectsSuite = [];

      for (const argumentDecrement of possibleCallbackPositions) {
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

            beforeEach('setup success stub for callback case', function () {
              superPromise = Promise.resolve(expectedResult);
              stubbedMethod = makeStub(className, method, superPromise);
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

            beforeEach('setup error stub for callback case', function () {
              superPromise = Promise.reject(expectedError);
              stubbedMethod = makeStub(className, method, superPromise);
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

          beforeEach('setup success stub for promise case', function () {
            superPromise = Promise.resolve(expectedResult);
            stubbedMethod = makeStub(className, method, superPromise);
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

          beforeEach('setup error stub for promise case', function () {
            superPromise = Promise.reject(expectedError);
            stubbedMethod = makeStub(className, method, superPromise);
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

function makeInstance({ client, db, namespace, collection }, className) {
  const CLASS_FACTORY = new Map([
    ['Admin', () => new mongodbLegacy.Admin(db)],
    ['AggregationCursor', () => new mongodbLegacy.AggregationCursor(client, namespace)],
    ['ChangeStream', () => new mongodbLegacy.ChangeStream(client)],
    ['ClientSession', () => client.startSession()],
    ['Collection', () => new mongodbLegacy.Collection(db, 'pets')],
    ['Db', () => new mongodbLegacy.Db(client, 'animals')],
    ['FindCursor', () => new mongodbLegacy.FindCursor(client, namespace)],
    ['GridFSBucket', () => new mongodbLegacy.GridFSBucket(db)],
    [
      'GridFSBucketWriteStream',
      () => {
        const stream = new mongodbLegacy.GridFSBucket(db).openUploadStream('file');
        stream.on('error', () => {});
        return stream;
      }
    ],
    ['ListCollectionsCursor', () => new mongodbLegacy.ListCollectionsCursor(db, {})],
    ['ListIndexesCursor', () => new mongodbLegacy.ListIndexesCursor(collection)],
    ['MongoClient', () => new mongodbLegacy.MongoClient('mongodb://iLoveJavascript')],
    ['OrderedBulkOperation', () => collection.initializeOrderedBulkOp()],
    ['UnorderedBulkOperation', () => collection.initializeUnorderedBulkOp()]
  ]);

  const _default = () => {
    throw new Error('Unsupported classname: ' + className);
  };
  const factory = CLASS_FACTORY.get(className) ?? _default;

  return factory();
}

function makeStub(className, method, superPromise) {
  return sinon.stub(mongodbDriver[className].prototype, method).returns(superPromise);
}
