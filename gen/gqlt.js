// Hey Emacs, this is -*- coding: utf-8 -*-
/* global require, exports */

const fs = require('mz/fs');
const path = require('path');
const { execSync } = require('child_process');

const utils = require('./utils');

function extractClientSchema(typeDefsFilePath, localSchemaPath) {
  console.log(path.resolve(localSchemaPath));
  let clientStateString = fs.readFileSync(typeDefsFilePath, 'utf8');
  let clientStateGraphqlString = '';
  let regExp = /const schema = `\n([\s\S]*)`;/;
  let m = regExp.exec(clientStateString);
  if(m) clientStateGraphqlString = m[1];
  fs.writeFileSync(localSchemaPath, clientStateGraphqlString);
}

function generateTypesForDir(
  dirPath, remoteSchemaPath, localSchemaPath, apolloPath)
{
  const files = utils.readdirRecursiveSync(dirPath);
  const graphqlFiles = files.reduce((graphqlFiles, fileToCheck) => {
    if(/\.graphql$/.test(fileToCheck))
      return graphqlFiles.concat(fileToCheck);
    return graphqlFiles;
  }, []);
  graphqlFiles.forEach(
    file => generateTypesForFile(
      file, remoteSchemaPath, localSchemaPath, apolloPath));
}

/**
 * Generate TypeScript types file for GraphQL queries file
 *
 * @param {string} graphqlFilePath - GraphQL queries file path
 * @param {string} remoteSchemaPath - Remote schema file path
 * @param {string} localSchemaPath - Local schema file path
 * @param {string} apolloPath - Path to apollo executable
 */
function generateTypesForFile(
  graphqlFilePath, remoteSchemaPath, localSchemaPath, apolloPath)
{
  const outFilePath = graphqlFilePath.replace(/(\.graphql)$/, '.ts');
  const includesGlob = '{' + graphqlFilePath + ',' + localSchemaPath + '}';
  console.log(path.resolve(outFilePath));
  // see https://github.com/fenech/apollo-cli-example
  return execSync(apolloPath + ' client:codegen' +
                  ' --outputFlat --addTypename --passthroughCustomScalars' +
                  // ' --namespace="scalars"' +
                  ' --customScalarsPrefix="scalars."' +
                  // ' --globalTypesFile="xxx.ts"' +
                  ' --includes="' + includesGlob + '"' +
                  ' --localSchemaFile="' + remoteSchemaPath + '"' +
                  ' --target=typescript' +
                  ' ' + outFilePath,
                  { encoding: 'utf8' });
}

exports.generateTypesForDir = generateTypesForDir;
exports.generateTypesForFile = generateTypesForFile;
exports.extractClientSchema = extractClientSchema;
