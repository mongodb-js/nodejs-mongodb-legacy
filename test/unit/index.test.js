'use strict';

const { expect } = require('chai');
const mdbLegacy = require('../..');
const mdbDriver = require('mongodb');
const { classNames, classNameToMethodList } = require('../tools/api');
const { byStrings, sorted } = require('../tools/utils');

const classNameToMethodNameList = new Map(
  Array.from(classNameToMethodList.entries()).map(([className, methods]) => [
    className,
    sorted(
      methods.map(({ method }) => method),
      byStrings
    )
  ])
);

describe('index.js', () => {
  it('should export everything mongodb does', () => {
    const mdbDriverExportKeys = Object.keys(mdbDriver);
    expect(mdbLegacy).to.have.all.keys(mdbDriverExportKeys);
    for (const exportKey of mdbDriverExportKeys.filter(k => !classNames.has(k))) {
      expect(mdbLegacy, `expected mongodb legacy not to override export ${exportKey}`)
        .to.have.property(exportKey)
        .that.equals(mdbDriver[exportKey]);
    }
  });

  for (const className of classNames) {
    it(`should export ${className} as a subclass of mongodb.${className}`, () => {
      expect(mdbLegacy[className]).to.have.property('prototype');
      expect(mdbLegacy[className].prototype).to.be.instanceOf(mdbDriver[className]);
    });
  }

  describe('subclass for legacy callback support', () => {
    for (const [className, methodNames] of classNameToMethodNameList) {
      describe(`class ${className}`, () => {
        for (const method of methodNames) {
          it(`should define override ${method}()`, () => {
            expect(mdbLegacy[className].prototype)
              .to.have.own.property(method)
              .that.is.a('function');
          });
        }

        it(`should only define methods declared in api table for ${className}`, () => {
          let names = sorted(
            Object.getOwnPropertyNames(mdbLegacy[className].prototype).filter(
              name => name !== 'constructor'
            ),
            byStrings
          );
          expect(names).to.be.deep.equal(methodNames);
        });
      });
    }

    it('class MongoClient should define static override connect()', () => {
      expect(mdbLegacy.MongoClient).to.have.own.property('connect').that.is.a('function');
    });
  });
});
