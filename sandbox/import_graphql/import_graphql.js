// Hey Emacs, this is -*- coding: utf-8 -*-
/* global require */

const XRegExp = require('xregexp');

const graphqlString = `fragment Friends on Character {
  friends {
    name
  }
}

fragment AppearsIn on Character {
  appearsIn {
    title
  }
}

query GetCharacter($episode: String!) {
  hero(episode: $episode) {
    name
    id
    ...AppearsIn
    ...Friends
  }
}

query GetHuman($id: String!) {
  human(id: $id) {
    name
    ...Friends
  }
}
`;

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

function extractOperations(blocks) {
  return blocks.reduce((result, operation) => {
    let regExp = /\s*(query|mutation)[\s\n\r]+(.+)[\s\n\r]*\([^]*?{/;
    let m = regExp.exec(operation);
    if(m) {
      let name = m[2] + m[1].charAt(0).toUpperCase() + m[1].slice(1);
      result.push({
        name,
        operation: operation,
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

function extractFragments(blocks) {
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

function makeGqlDefinitions(operations, fragments) {
}

function parseGqlDefinitions(strings) {
}

function generateJsonDefinitions(objects) {
}

//   /\s*(query|mutation)[\s\n\r]+(.+)[\s\n\r]*\([^]*?{/.exec(graphqlOps[2]);

// query, fragment or mutation with parameters
// let regex = /\s*(?:query|mutation)[\s\n\r]+(.+)[\s\n\r]*\([^]*?{[^]*}/
// regex.exec(graphqlString);
