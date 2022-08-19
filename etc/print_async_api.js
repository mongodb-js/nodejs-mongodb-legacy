#! /usr/bin/env node
/* eslint-disable no-console */

'use strict';

const { stat, readFile, writeFile } = require('fs/promises');
const { join: joinPath } = require('path');
const { spawn } = require('child_process');

const { ApiModel } = require('@microsoft/api-extractor-model');
const { inspect } = require('util');

class APIPrinterError extends Error {}

const readJSON = async filePath => JSON.parse(await readFile(filePath, { encoding: 'utf8' }));
const writeJSON = async (filePath, content) =>
  await writeFile(filePath, Buffer.from(JSON.stringify(content, undefined, 4), 'utf8'), {
    encoding: 'utf8'
  });
const awaitableSpawn = async (command, options) => {
  const [program, ...cliArgs] = command.split(' ');
  const child = spawn(program, cliArgs, { ...options, stdio: 'inherit' });
  return new Promise((resolve, reject) => {
    child.addListener('exit', code => resolve(code));
    child.addListener('error', error => reject(error));
  });
};

const DRIVER_REPO_DIR = joinPath(__dirname, 'node-mongodb-native');
const API_CONFIG = joinPath(DRIVER_REPO_DIR, 'api-extractor.json');
const DOC_MODEL = joinPath(DRIVER_REPO_DIR, 'etc/api.json');

async function getDriverAPI() {
  const repoExists = await stat(DRIVER_REPO_DIR).then(statRes => statRes.isDirectory());
  if (!repoExists) {
    throw new APIPrinterError('You must clone the driver repo next to this script');
  }

  await awaitableSpawn('npm install', { cwd: DRIVER_REPO_DIR });

  const apiExtractorConfig = await readJSON(API_CONFIG);
  apiExtractorConfig.docModel.enabled = true;
  apiExtractorConfig.docModel.apiJsonFilePath = 'etc/api.json';
  await writeJSON(API_CONFIG, apiExtractorConfig);

  await awaitableSpawn('npm run build:dts', { cwd: DRIVER_REPO_DIR });

  return await readJSON(DOC_MODEL);
}

/**
 * @param {string[]} args
 */
async function main(args) {
  if (args.includes('build:api')) {
    return await getDriverAPI();
  }
  const apiModel = new ApiModel();
  const apiPackage = apiModel.loadPackage(DOC_MODEL);

  const apiList = [];

  const recursivelyWalkApi = rootMember => {
    if (rootMember == null) {
      return;
    }
    const printedMethods = new Set(); // make overloads only print once
    for (const member of rootMember.members) {
      if (member.kind === 'Method') {
        /** @type {string} */
        const returnType = member.returnTypeExcerpt.text;
        if (returnType.includes('Promise<') && !printedMethods.has(member.name)) {
          apiList.push({ className: member.parent.name, method: member.name, returnType });
        }
        printedMethods.add(member.name);
      }
      recursivelyWalkApi(member);
    }
  };
  recursivelyWalkApi(apiPackage);

  writeFile(
    'test/tools/api.new.js', // use new in the name to not override the source of truth
    Buffer.from(
      `/* eslint-disable prettier/prettier */
'use strict';

module.exports = Object.create(null);
Object.defineProperty(module.exports, '__esModule', { value: true });

module.exports.asyncApi = [
  ${apiList.map(v => inspect(v, { depth: Infinity, breakLength: Infinity })).join(',\n  ')}
];
`,
      'utf8'
    )
  );
}

main(process.argv)
  .then(() => {
    process.exitCode = 0;
  })
  .catch(error => {
    console.error(`Fatal: ${error.message}\n${error.stack}`);
    process.exitCode = 1;
  });
