'use strict';

const { MongoClient: LegacyMongoClient } = require('../../../src/index');
const { Admin } = require('mongodb');
const sinon = require('sinon');
const { expect } = require('chai');
const { runMicroTask } = require('../../tools/utils');

describe('legacy_wrappers/admin.js', () => {
  let admin;
  let client;

  afterEach(async function () {
    sinon.restore();
    await client.close();
  });

  describe('addUser()', () => {
    let stubbedMethod;
    let callback;
    let superPromise;
    let actualReturnValue;

    beforeEach(async () => {
      client = new LegacyMongoClient('mongodb://iLoveJs');
      admin = client.db().admin();
      superPromise = Promise.resolve({ message: 'success!' });
      stubbedMethod = sinon.stub(Admin.prototype, 'addUser').returns(superPromise);
      callback = sinon.stub();
    });

    describe(`and addUser is called with ('name', callback)`, () => {
      beforeEach(() => {
        actualReturnValue = admin.addUser('name', callback);
      });

      it('should return void', () => expect(actualReturnValue).to.be.undefined);

      it('should call the callback with undefined error and successful result', async () => {
        await runMicroTask();
        expect(callback).to.have.been.calledOnceWith(undefined, { message: 'success!' });
      });

      it(`should pass only ('name') to the driver api`, () => {
        expect(stubbedMethod).to.have.been.calledOnceWithExactly('name', undefined, undefined);
      });
    });

    describe(`and addUser is called with ('name', 'pass', callback)`, () => {
      beforeEach(() => {
        actualReturnValue = admin.addUser('name', 'pass', callback);
      });

      it('should return void', () => expect(actualReturnValue).to.be.undefined);

      it('should call the callback with undefined error and successful result', async () => {
        await runMicroTask();
        expect(callback).to.have.been.calledOnceWith(undefined, { message: 'success!' });
      });

      it(`should pass only ('name', 'pass') to the driver api`, () => {
        expect(stubbedMethod).to.have.been.calledOnceWithExactly('name', 'pass', undefined);
      });
    });

    describe(`and addUser is called with ('name', 'pass', options, callback)`, () => {
      beforeEach(() => {
        actualReturnValue = admin.addUser('name', 'pass', { options: true }, callback);
      });

      it('should return void', () => expect(actualReturnValue).to.be.undefined);

      it('should call the callback with undefined error and successful result', async () => {
        await runMicroTask();
        expect(callback).to.have.been.calledOnceWith(undefined, { message: 'success!' });
      });

      it(`should pass only ('name', 'pass', options) to the driver api`, () => {
        expect(stubbedMethod).to.have.been.calledOnceWithExactly('name', 'pass', {
          options: true
        });
      });
    });

    describe(`and addUser is called with ('name', options, callback)`, () => {
      beforeEach(() => {
        actualReturnValue = admin.addUser('name', { options: true }, callback);
      });

      it('should return void', () => expect(actualReturnValue).to.be.undefined);

      it('should call the callback with undefined error and successful result', async () => {
        await runMicroTask();
        expect(callback).to.have.been.calledOnceWith(undefined, { message: 'success!' });
      });

      it(`should pass only ('name', undefined, options) to the driver api`, () => {
        expect(stubbedMethod).to.have.been.calledOnceWithExactly('name', undefined, {
          options: true
        });
      });
    });

    describe(`and addUser is called with ('name')`, () => {
      beforeEach(() => {
        actualReturnValue = admin.addUser('name');
      });

      it('should return the same promise the driver returns', async () => {
        expect(actualReturnValue).to.equal(superPromise);
      });

      it('should return a resolved promise', async () => {
        const result = await actualReturnValue;
        expect(result).to.have.property('message', 'success!');
      });

      it(`should pass only ('name') to the driver api`, () => {
        expect(stubbedMethod).to.have.been.calledOnceWithExactly('name', undefined, undefined);
      });
    });

    describe(`and addUser is called with ('name', 'pass')`, () => {
      beforeEach(() => {
        actualReturnValue = admin.addUser('name', 'pass');
      });

      it('should return the same promise the driver returns', async () => {
        expect(actualReturnValue).to.equal(superPromise);
      });

      it('should return a resolved promise', async () => {
        const result = await actualReturnValue;
        expect(result).to.have.property('message', 'success!');
      });

      it(`should pass only ('name', 'pass') to the driver api`, () => {
        expect(stubbedMethod).to.have.been.calledOnceWithExactly('name', 'pass', undefined);
      });
    });

    describe(`and addUser is called with ('name', 'pass', options)`, () => {
      beforeEach(() => {
        actualReturnValue = admin.addUser('name', 'pass', { options: true });
      });

      it('should return the same promise the driver returns', async () => {
        expect(actualReturnValue).to.equal(superPromise);
      });

      it('should return a resolved promise', async () => {
        const result = await actualReturnValue;
        expect(result).to.have.property('message', 'success!');
      });

      it(`should pass only ('name', 'pass', options) to the driver api`, () => {
        expect(stubbedMethod).to.have.been.calledOnceWithExactly('name', 'pass', {
          options: true
        });
      });
    });
  });
});
