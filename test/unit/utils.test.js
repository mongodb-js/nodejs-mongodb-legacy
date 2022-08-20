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

    it('should return promise provided if no other arguments are present', async () => {
      const promise = Promise.resolve(2);
      const result = maybeCallback(promise);
      expect(promise).to.equal(result);
      expect(await result).to.equal(2);
    });

    it('should return void if callback is provided', () => {
      const promise = Promise.resolve(2);
      const result = maybeCallback(promise, () => null);
      expect(result).to.be.undefined;
    });

    it('should call callback with the resolved value from the promise', done => {
      const promise = Promise.resolve(2);
      const result = maybeCallback(promise, (error, result) => {
        try {
          expect(error).to.not.exist;
          expect(result).to.equal(2);
          done();
        } catch (assertionError) {
          done(assertionError);
        }
      });
      expect(result).to.be.undefined;
    });

    it('should not modify a rejection error promise', async () => {
      class MyError extends Error {}
      const rejection = Promise.reject(new MyError());
      const thrownError = await maybeCallback(rejection, null).catch(error => error);
      expect(thrownError).to.be.instanceOf(MyError);
    });

    it('should not modify a rejection error callback', done => {
      class MyError extends Error {}
      const rejection = Promise.reject(new MyError());
      maybeCallback(rejection, (error, result) => {
        try {
          expect(result).to.not.exist;
          expect(error).to.be.instanceOf(MyError);
          return done();
        } catch (assertionError) {
          return done(assertionError);
        }
      });
    });
  });
});
