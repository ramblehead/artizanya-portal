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

const mr = XRegExp.matchRecursive(graphqlString, '{', '}', 'g', {
  valueNames: ['between', 'left', 'match', 'right']
});

let graphqlOps = [];

for(let i = 0; i < mr.length; ++i) {
  let graphqlOp = '';
  if(mr[i].name === 'between') {
    graphqlOp = mr[i++].value.trim();        // [graphql operation]
    if(graphqlOp === '') continue;
    graphqlOp += ' ' + mr[i++].value.trim(); // {
    graphqlOp += mr[i++].value;              // [graphql body]
    graphqlOp += mr[i].value.trim();         // }
  }
  if(graphqlOp) graphqlOps.push(graphqlOp);
}

let graphqlQmOps = graphqlOps.reduce((result, op) => {
  let regExp = /\s*(query|mutation)[\s\n\r]+(.+)[\s\n\r]*\([^]*?{/;
  let m = regExp.exec(op);
  if(m) {
    let name = m[2] + m[1].charAt(0).toUpperCase() + m[1].slice(1);
    result.push({
      name,
      graphqlOp: op,
      fragments: usedGraphqlFragments(op)
    });
  }
  return result;
}, []);

let graphqlFOps = graphqlOps.reduce((result, op) => {
  let regExp = /\s*(fragment)[\s\n\r]+(\S+)\s+on\s+(\S+)\s*\{/;
  let m = regExp.exec(op);
  if(m) {
    let fragmentName = m[2];
    result[fragmentName] = op;
  }
  return result;
}, {});

function usedGraphqlFragments(op) {
  let result = [];
  let regExp = /\.\.\.[\s\n\r]*(\S+)/g;
  let m = regExp.exec(op);
  while(m) {
    result.push(m[1]);
    m = regExp.exec(op);
  }
  return result;
}

//   /\s*(query|mutation)[\s\n\r]+(.+)[\s\n\r]*\([^]*?{/.exec(graphqlOps[2]);

// query, fragment or mutation with parameters
// let regex = /\s*(?:query|mutation)[\s\n\r]+(.+)[\s\n\r]*\([^]*?{[^]*}/
// regex.exec(graphqlString);
