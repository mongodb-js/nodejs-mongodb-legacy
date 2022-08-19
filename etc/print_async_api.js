#! /usr/bin/env node
/* eslint-disable no-console */

'use strict';

const { stat, readFile, writeFile } = require('fs/promises');
const { join: joinPath } = require('path');
const { spawn } = require('child_process');
const typescript = require('typescript');

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
  const apiExists = await stat(DOC_MODEL).then(statRes => statRes.isFile());
  if (apiExists) {
    return await readJSON(DOC_MODEL);
  }

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

async function main() {
  const api = await getDriverAPI();

  console.log(api.name);
  const packageMembers = api.members[0].members;

  for (const classDescription of packageMembers.filter(m => m.kind === 'Class')) {
    const className = classDescription.name;
    for (const methodDescription of classDescription.members.filter(m => m.kind === 'Method')) {
      /** @type {string} */
      const returnType = methodDescription.excerptTokens
        .slice(
          methodDescription.returnTypeTokenRange.startIndex,
          methodDescription.returnTypeTokenRange.endIndex
        )
        .map(token => token.text.replaceAll('\n', '').replace(/\s\s+/g, ' '))
        .join('');
      if (returnType.includes('Promise')) {
        const apiString = `${className}.${methodDescription.name}(): ${returnType}`;
        console.log(apiString);
      }
    }
  }
}

main()
  .then(() => {
    process.exitCode = 0;
  })
  .catch(error => {
    console.error(`Fatal: ${error.message}\n${error.stack}`);
    process.exitCode = 1;
  });
