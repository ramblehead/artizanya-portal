// Hey Emacs, this is -*- coding: utf-8 -*-
/* global require, exports */

const path = require('path');
const fs = require('mz/fs');

const XRegExp = require('xregexp');
const gql = require('graphql-tag');

exports.compileDir = compileDir;
exports.compileFile = compileFile;

function compileDir(dirPath) {
  const files = readdir(dirPath);
  const graphqlFiles = files.reduce((graphqlFiles, fileToCheck) => {
    if(/\.graphql$/.test(fileToCheck)) return graphqlFiles.concat(fileToCheck);
    return graphqlFiles;
  }, []);
  graphqlFiles.forEach(file => compileFile(file));
}

function compileFile(filePath) {
  const outFilePath = filePath.replace(/(\.graphql)$/, ".js");
  const graphqlString = fs.readFileSync(filePath, "utf8");
  const blocks = extractBlocks(graphqlString);
  const operations = filterOperations(blocks);
  const fragments = filterFragments(blocks);
  const gqlStrings = makeGqlStrings(operations, fragments);
  const gqlObjects = makeGqlObjects(gqlStrings);
  const jsonStrings = makeJsonStrings(gqlObjects);
  writeJsFile(outFilePath, jsonStrings);
}

function flatten(arr) {
  return arr.reduce(
    (flat, toFlatten) =>
      flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten),
    []);
}

function readdir(dirPath) {
  const entries = fs.readdirSync(dirPath);
  const files = entries.map(entry => {
    const entryPath = path.join(dirPath, entry);
    const stat = fs.statSync(entryPath);
    return stat.isDirectory() ? readdir(entryPath) : entryPath;
  });
  return flatten(files);
}

function extractBlocks(graphqlString) {
  const mr = XRegExp.matchRecursive(graphqlString, '{', '}', 'g', {
    valueNames: ['between', 'left', 'match', 'right']
  });

  let blocks = [];

  for(let i = 0; i < mr.length; ++i) {
    let block = '';
    if(mr[i].name === 'between') {
      block = mr[i++].value.trim();        // [graphql operation]
      if(block === '') continue;
      block += ' ' + mr[i++].value.trim(); // {
      block += mr[i++].value;              // [graphql body]
      block += mr[i].value.trim();         // }
    }
    if(block) blocks.push(block);
  }

  return blocks;
}

function filterOperations(blocks) {
  return blocks.reduce((result, operation) => {
    let regExp = /\s*(query|mutation)[\s\n\r]+(.+)[\s\n\r]*\([^]*?{/;
    let m = regExp.exec(operation);
    if(m) {
      let name = m[2] + m[1].charAt(0).toUpperCase() + m[1].slice(1);
      result.push({
        name,
        definition: operation,
        fragmentNames: findFragmentNames(operation)
      });
    }
    return result;
  }, []);
}

function findFragmentNames(operation) {
  let result = [];
  let regExp = /\.\.\.[\s\n\r]*(\S+)/g;
  let m = regExp.exec(operation);
  while(m) {
    result.push(m[1]);
    m = regExp.exec(operation);
  }
  return result;
}

function filterFragments(blocks) {
  return blocks.reduce((result, operation) => {
    let regExp = /\s*(fragment)[\s\n\r]+(\S+)\s+on\s+(\S+)\s*\{/;
    let m = regExp.exec(operation);
    if(m) {
      let fragmentName = m[2];
      result[fragmentName] = operation;
    }
    return result;
  }, {});
}

function makeGqlStrings(operations, fragments) {
  return operations.map(operation => {
    let gqlString = operation.definition + "\n";
    for(let fragmentName of operation.fragmentNames) {
      gqlString += "\n" + fragments[fragmentName] + "\n";
    }
    return {
      name: operation.name,
      value: gqlString
    };
  });
}

function makeGqlObjects(gqlStrings) {
  return gqlStrings.map(gqlString => ({
    name: gqlString.name,
    value: gql(gqlString.value)
  }));
}

function makeJsonStrings(gqlObjects) {
  return gqlObjects.map(gqlObject => ({
    name: gqlObject.name,
    value: JSON.stringify(gqlObject.value, null, 2)
  }));
}

function writeJsFile(fileName, jsonStrings) {
  const fstream = fs.createWriteStream(fileName);
  fstream.write('// Hey Emacs, this is -*- coding: utf-8 -*-\n');
  fstream.write('/* global exports */\n');
  for(let jsonString of jsonStrings) {
    fstream.write('\nexports.' + jsonString.name + ' = ');
    fstream.write(jsonString.value);
    fstream.write(';\n');
  }
}
