// Hey Emacs, this is -*- coding: utf-8 -*-
/* global require, exports */

const path = require('path');
const fs = require('mz/fs');

const XRegExp = require('xregexp');
const gql = require('graphql-tag');

function upperCaseInitial(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowerCaseInitial(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

function flatten(array) {
  return array.reduce(
    (flat, toFlatten) =>
      flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten),
    []);
}

function readdirRecursiveSync(dirPath) {
  const entries = fs.readdirSync(dirPath);
  const files = entries.map(entry => {
    const entryPath = path.join(dirPath, entry);
    const stat = fs.statSync(entryPath);
    return stat.isDirectory() ? readdirRecursiveSync(entryPath) : entryPath;
  });
  return flatten(files);
}

function extractDefinitions(graphqlString) {
  const mr = XRegExp.matchRecursive(graphqlString, '{', '}', 'g', {
    valueNames: ['between', 'left', 'match', 'right']
  });

  let definitions = [];

  for(let i = 0; i < mr.length; ++i) {
    let definition = '';
    if(mr[i].name === 'between') {
      definition = mr[i++].value.trim();        // [graphql operation]
      if(definition === '') continue;
      definition += ' ' + mr[i++].value.trim(); // {
      definition += mr[i++].value;              // [graphql body]
      definition += mr[i].value.trim();         // }
    }
    if(definition) definitions.push(definition);
  }

  return definitions;
}

function filterOperations(definitions) {
  return definitions.reduce((result, operation) => {
    let regExp = /\s*(query|mutation)[\s\n\r]+(.+)[\s\n\r]*\([^]*?{/;
    let m = regExp.exec(operation);
    if(m) {
      let name = lowerCaseInitial(m[2]) + upperCaseInitial(m[1]) + 'Gql';
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

function filterFragments(definitions) {
  return definitions.reduce((result, operation) => {
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
    let gqlString = operation.definition + '\n';
    for(let fragmentName of operation.fragmentNames) {
      gqlString += '\n' + fragments[fragmentName] + '\n';
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

function makeGqlJsonStrings(gqlObjects) {
  return gqlObjects.map(gqlObject => ({
    name: gqlObject.name,
    value: JSON.stringify(gqlObject.value, null, 2).replace(/\"/g, "'")
  }));
}

function writeTsFile(fileName, gqlJsonStrings) {
  const fstream = fs.createWriteStream(fileName);
  fstream.write('// Hey Emacs, this is -*- coding: utf-8 -*-\n');
  fstream.write('/* global exports */\n');
  let exportNames = [];
  for(let jsonString of gqlJsonStrings) {
    let exportName = jsonString.name;
    exportNames.push(exportName);
    let objectName = jsonString.name + 'Object';
    let castToAnyLine = 'let ' + exportName + ' = ' + objectName + ' as any;\n';
    fstream.write('\nlet ' + objectName + ' = ');
    fstream.write(jsonString.value);
    fstream.write(';\n\n');
    fstream.write(castToAnyLine);
  };
  if(exportNames) {
    fstream.write('\nexport {\n');
    for(let exportName of exportNames.slice(0, -1)) {
      fstream.write('  ' + exportName + ',\n');
    };
    let exportNameLast = exportNames.slice(-1);
    if(exportNameLast) {
      fstream.write('  ' + exportNameLast + '\n');
    }
    fstream.write('};\n');
  };
}

function compileDir(dirPath) {
  const files = readdirRecursiveSync(dirPath);
  const graphqlFiles = files.reduce((graphqlFiles, fileToCheck) => {
    if(/\.graphql$/.test(fileToCheck)) return graphqlFiles.concat(fileToCheck);
    return graphqlFiles;
  }, []);
  graphqlFiles.forEach(file => compileFile(file));
}

function compileFile(graphqlFilePath) {
  console.log(path.resolve(graphqlFilePath));
  const tsFilePath = graphqlFilePath.replace(/(\.graphql)$/, '.ts');
  let gqlInString = fs.readFileSync(graphqlFilePath, 'utf8');
  gqlInString = gqlInString.replace(/#.*/g, '');
  const definitions = extractDefinitions(gqlInString);
  const operations = filterOperations(definitions);
  const fragments = filterFragments(definitions);
  const gqlOutStrings = makeGqlStrings(operations, fragments);
  const gqlObjects = makeGqlObjects(gqlOutStrings);
  const gqlJsonStrings = makeGqlJsonStrings(gqlObjects);
  writeTsFile(tsFilePath, gqlJsonStrings);
}

exports.compileDir = compileDir;
exports.compileFile = compileFile;
