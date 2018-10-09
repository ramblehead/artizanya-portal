// Hey Emacs, this is -*- coding: utf-8 -*-
/* global require, exports */

const path = require('path');
const { execSync } = require('child_process');

const utils = require('./utils');

function generateTypesForDir(dirPath, schemaPath, apolloPath) {
  const files = utils.readdirRecursiveSync(dirPath);
  const graphqlFiles = files.reduce((graphqlFiles, fileToCheck) => {
    if(/\.graphql$/.test(fileToCheck) && !/^.*\/local/.test(fileToCheck))
      return graphqlFiles.concat(fileToCheck);
    return graphqlFiles;
  }, []);
  graphqlFiles.forEach(
    file => generateTypesForFile(file, schemaPath, apolloPath));
}

function generateTypesForFile(graphqlFilePath, schemaPath, apolloPath) {
  const outFilePath = graphqlFilePath.replace(/(\.graphql)$/, '-types.ts');
  console.log(path.resolve(outFilePath));
  return execSync(apolloPath + ' codegen:generate ' +
                  ' --queries="' + graphqlFilePath + '"' +
                  // ' --clientSchema="../src/client-state.graphql"' +
                  ' --schema="' + schemaPath + '"' +
                  ' --target=typescript ' +
                  '--outputFlat ' +
                  outFilePath,
                  { encoding: 'utf8' });
}

exports.generateTypesForDir = generateTypesForDir;
exports.generateTypesForFile = generateTypesForFile;
