// Hey Emacs, this is -*- coding: utf-8 -*-
/* global require, exports */

const path = require('path');
const { execSync } = require('child_process');

const utils = require('./utils');

function generateTypesForDir(dirPath, schemaPath, apolloCodegenPath) {
  const files = utils.readdirRecursiveSync(dirPath);
  const graphqlFiles = files.reduce((graphqlFiles, fileToCheck) => {
    if(/\.graphql$/.test(fileToCheck)) return graphqlFiles.concat(fileToCheck);
    return graphqlFiles;
  }, []);
  graphqlFiles.forEach(file => generateTypesForFile(file,
                                                    schemaPath,
                                                    apolloCodegenPath));
}

function generateTypesForFile(graphqlFilePath, schemaPath, apolloCodegenPath) {
  const outFilePath = graphqlFilePath.replace(/(\.graphql)$/, '-types.ts');
  console.log(path.resolve(outFilePath));
  return execSync(apolloCodegenPath +
                  ' generate ' + graphqlFilePath +
                  ' --schema ' + schemaPath +
                  ' --target typescript' +
                  ' --output ' + outFilePath,
                  { encoding: 'utf8' });
}

exports.generateTypesForDir = generateTypesForDir;
exports.generateTypesForFile = generateTypesForFile;
