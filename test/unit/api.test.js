'use strict';

const sinon = require('sinon');
const { expect } = require('chai');

const mongodbDriver = require('mongodb');
const mongodbLegacy = require('../..');
const { MongoDBNamespace } = require('mongodb/lib/utils');
const { asyncApi } = require('../tools/api');

const classesToMethods = new Map(
  asyncApi.map((api, _, array) => [
    api.className,
    new Set(array.filter(v => v.className === api.className))
  ])
);

const iLoveJs = 'mongodb://iLoveJavascript';
const client = new mongodbLegacy.MongoClient(iLoveJs);
const db = new mongodbLegacy.Db(client, 'animals');
const collection = new mongodbLegacy.Collection(db, 'pets');
const namespace = MongoDBNamespace.fromString('animals.pets');

const OVERRIDDEN_CLASSES_GETTER = new Map([
  ['Admin', () => new mongodbLegacy.Admin(db)],
  ['FindCursor', () => new mongodbLegacy.FindCursor(client, namespace)],
  ['ListCollectionsCursor', () => new mongodbLegacy.ListCollectionsCursor(db, {})],
  ['ListIndexesCursor', () => new mongodbLegacy.ListIndexesCursor(collection)],
  ['AggregationCursor', () => new mongodbLegacy.AggregationCursor(client, namespace)],
  ['ChangeStream', () => new mongodbLegacy.ChangeStream(client)],
  ['GridFSBucket', () => new mongodbLegacy.GridFSBucket(db)],
  ['Collection', () => new mongodbLegacy.Collection(db, 'pets')],
  ['Db', () => new mongodbLegacy.Db(client, 'animals')],
  ['MongoClient', () => new mongodbLegacy.MongoClient(iLoveJs)]
]);

function* generateTests() {
  for (const [className, getInstance] of OVERRIDDEN_CLASSES_GETTER) {
    /** @type {{ className: string; method: string; returnType: string; special?: string; }[]} */
    let methods = classesToMethods.get(className);
    if (methods == null) methods = [];
    for (const { method, special, possibleCallbackPositions } of methods) {
      if (typeof special === 'string' && special.length !== 0) continue;
      const apiName = `${className}.${method}`;
      const instance = getInstance();
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

describe('Maybe Callback', () => {
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
    const functionLength = instance[method].length;

    context(`${apiName}()`, () => {
      for (const callbackPosition of possibleCallbackPositions != null
        ? possibleCallbackPositions
        : [1, 2]) {
        if (callbackPosition === 2) {
          if (functionLength < 2) continue;
        }
        it(`returns void and uses callback(_, result) in position ${
          functionLength - callbackPosition
        }`, async () => {
          const superPromise = Promise.resolve({ message: 'success!' });
          makeStub(superPromise);

          expect(instance).to.have.property(method).that.is.a('function');

          const callback = sinon.spy();

          const args = Array.from({ length: functionLength }, (_, i) => i);
          args[functionLength - callbackPosition] = callback;
          args.length = functionLength - (callbackPosition - 1);
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

        it(`returns void and uses callback(error) in position ${
          functionLength - callbackPosition
        }`, async () => {
          const superPromise = Promise.reject(new Error('error!'));
          makeStub(superPromise);

          expect(instance).to.have.property(method).that.is.a('function');

          const callback = sinon.spy();

          const args = Array.from({ length: functionLength }, (_, i) => i);
          args[functionLength - callbackPosition] = callback;
          args.length = functionLength - (callbackPosition - 1);
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

      it(`returns resolved promise`, async () => {
        // should have a message property to make equality checking consistent
        const superPromise = Promise.resolve({ message: 'success!' });
        makeStub(superPromise);

        expect(instance).to.have.property(method).that.is.a('function');

        const args = Array.from({ length: functionLength - 1 }, (_, i) => i);
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

      it('returns rejected promise', async () => {
        const superPromise = Promise.reject(new Error('error!'));
        makeStub(superPromise);

        expect(instance).to.have.property(method).that.is.a('function');

        const args = Array.from({ length: functionLength - 1 }, (_, i) => i);
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
