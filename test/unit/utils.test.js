'use strict';

const { expect } = require('chai');
const utils = require('../../src/utils');

describe('utils.js', () => {
  describe('exports', () => {
    it('should have toLegacy symbol', () => {
      expect(utils).to.have.property('toLegacy').that.is.a('symbol');
    });

    it('should have maybeCallback helper', () => {
      expect(utils).to.have.property('maybeCallback').that.is.a('function');
    });
  });

  describe('maybeCallback', () => {
    const maybeCallback = utils.maybeCallback;
    it('should accept to two arguments', () => {
      expect(maybeCallback).to.have.lengthOf(2);
    });

    describe('when handling an error case', () => {
      it('should pass the error to the callback provided', done => {
        const superPromiseRejection = Promise.reject(new Error('fail'));
        const result = maybeCallback(superPromiseRejection, (error, result) => {
          try {
            expect(result).to.not.exist;
            expect(error).to.be.instanceOf(Error);
            return done();
          } catch (assertionError) {
            return done(assertionError);
          }
        });
        expect(result).to.be.undefined;
      });

      it('should return the rejected promise to the caller when no callback is provided', async () => {
        const superPromiseRejection = Promise.reject(new Error('fail'));
        const returnedPromise = maybeCallback(superPromiseRejection, null);
        expect(returnedPromise).to.equal(superPromiseRejection);
        const thrownError = await returnedPromise.catch(error => error);
        expect(thrownError).to.be.instanceOf(Error);
      });

      it('should not modify a rejection error promise', async () => {
        class MyError extends Error {}
        const rejection = Promise.reject(new MyError());
        const thrownError = await maybeCallback(rejection, null).catch(error => error);
        expect(thrownError).to.be.instanceOf(MyError);
      });
    });

    describe('when handling a success case', () => {
      it('should pass the result and undefined error to the callback provided', done => {
        const superPromiseSuccess = Promise.resolve(2);

        const result = maybeCallback(superPromiseSuccess, (error, result) => {
          try {
            expect(error).to.be.undefined;
            expect(result).to.equal(2);
            done();
          } catch (assertionError) {
            done(assertionError);
          }
        });
        expect(result).to.be.undefined;
      });

      it('should return the resolved promise to the caller when no callback is provided', async () => {
        const superPromiseSuccess = Promise.resolve(2);
        const result = maybeCallback(superPromiseSuccess);
        expect(result).to.equal(superPromiseSuccess);
        expect(await result).to.equal(2);
      });
    });
  });
});
