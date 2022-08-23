'use strict';

const { expect } = require('chai');
const mdbLegacy = require('../..');
const mdbDriver = require('mongodb');
const { asyncApiClasses, classesToMethods } = require('../tools/api');

describe('index.js', () => {
  it('should export everything mongodb does', () => {
    expect(mdbLegacy).to.have.all.keys(Object.keys(mdbDriver));
  });

  for (const className of asyncApiClasses) {
    it(`should export ${className} as a subclass of mongodb.${className}`, () => {
      expect(mdbLegacy[className]).to.have.property('prototype');
      expect(mdbLegacy[className].prototype).to.be.instanceOf(mdbDriver[className]);
    });
  }

  describe('subclass for legacy callback support', () => {
    for (const [className, methods] of classesToMethods) {
      describe(`class ${className}`, () => {
        const methodNames = Array.from(new Set(Array.from(methods, ({ method }) => method)));
        methodNames.sort((a, b) => String.prototype.localeCompare.call(a, b));

        for (const method of methodNames) {
          it(`should define override ${method}()`, () => {
            expect(mdbLegacy[className].prototype)
              .to.have.own.property(method)
              .that.is.a('function');
          });
        }

        it(`should only define methods declared in api table for ${className}`, () => {
          let names = Object.getOwnPropertyNames(mdbLegacy[className].prototype).filter(
            name => name !== 'constructor'
          );
          names.sort((a, b) => String.prototype.localeCompare.call(a, b));
          expect(names).to.be.deep.equal(methodNames);
        });
      });
    }

    it('class MongoClient should define static override connect()', () => {
      expect(mdbLegacy.MongoClient).to.have.own.property('connect').that.is.a('function');
    });
  });
});
