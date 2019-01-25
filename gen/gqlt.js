// Hey Emacs, this is -*- coding: utf-8 -*-
/* global require, exports */

const fs = require('mz/fs');
const path = require('path');
const { execSync } = require('child_process');

const utils = require('./utils');

function extractClientSchema(typeDefsFilePath, clientSchemaPath) {
  console.log(path.resolve(clientSchemaPath));
  let clientStateString = fs.readFileSync(typeDefsFilePath, 'utf8');
  let clientStateGraphqlString = '';
  let regExp = /const typeDefs = `\n([\s\S]*)`;/;
  let m = regExp.exec(clientStateString);
  if(m) clientStateGraphqlString = m[1];
  fs.writeFileSync(clientSchemaPath, clientStateGraphqlString);
}

function generateTypesForDir(
  dirPath, schemaPath, clientSchemaPath, apolloPath)
{
  const files = utils.readdirRecursiveSync(dirPath);
  const graphqlFiles = files.reduce((graphqlFiles, fileToCheck) => {
    if(/\.graphql$/.test(fileToCheck) && !/^.*\/local/.test(fileToCheck))
      return graphqlFiles.concat(fileToCheck);
    return graphqlFiles;
  }, []);
  graphqlFiles.forEach(
    file => generateTypesForFile(
      file, schemaPath, clientSchemaPath, apolloPath));
}

function generateTypesForFile(
  graphqlFilePath, schemaPath, clientSchemaPath, apolloPath)
{
  const outFilePath = graphqlFilePath.replace(/(\.graphql)$/, '-types.ts');
  console.log(path.resolve(outFilePath));
  // see https://github.com/fenech/apollo-cli-example
  return execSync(apolloPath + ' client:codegen ' +
                  ' --includes="' + graphqlFilePath + '"' +
                  ' --clientSchema="' + clientSchemaPath + '"' +
                  ' --localSchemaFile="' + schemaPath + '"' +
                  ' --target=typescript' +
                  ' --outputFlat' +
                  ' ' + outFilePath,
                  { encoding: 'utf8' });
}

exports.generateTypesForDir = generateTypesForDir;
exports.generateTypesForFile = generateTypesForFile;
exports.extractClientSchema = extractClientSchema;
