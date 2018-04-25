// Hey Emacs, this is -*- coding: utf-8 -*-
/* global require */

const fs = require('mz/fs');

const XRegExp = require('xregexp');
const gql = require('graphql-tag');

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

class GraphqlCompiler {
  constructor(fileName) {
    this.inFileName = fileName;
    this.graphqlString = graphqlString;
    this.outFileName = "operations.js";
  }

  compile() {
    let S = GraphqlCompiler;
    let blocks = S.extractBlocks(this.graphqlString);
    let operations = S.extractOperations(blocks);
    let fragments = S.extractFragments(blocks);
    let gqlStrings = S.makeGqlStrings(operations, fragments);
    let gqlObjects = S.makeGqlObjects(gqlStrings);
    let jsonStrings = S.makeJsonStrings(gqlObjects);
    S.writeJsFile(this.outFileName, jsonStrings);
  }

  static extractBlocks(graphqlString) {
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

  static extractOperations(blocks) {
    return blocks.reduce((result, operation) => {
      let regExp = /\s*(query|mutation)[\s\n\r]+(.+)[\s\n\r]*\([^]*?{/;
      let m = regExp.exec(operation);
      if(m) {
        let name = m[2] + m[1].charAt(0).toUpperCase() + m[1].slice(1);
        result.push({
          name,
          definition: operation,
          fragmentNames: GraphqlCompiler.findFragmentNames(operation)
        });
      }
      return result;
    }, []);
  }

  static findFragmentNames(operation) {
    let result = [];
    let regExp = /\.\.\.[\s\n\r]*(\S+)/g;
    let m = regExp.exec(operation);
    while(m) {
      result.push(m[1]);
      m = regExp.exec(operation);
    }
    return result;
  }

  static extractFragments(blocks) {
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

  static makeGqlStrings(operations, fragments) {
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

  static makeGqlObjects(gqlStrings) {
    return gqlStrings.map(gqlString => ({
      name: gqlString.name,
      value: gql(gqlString.value)
    }));
  }

  static makeJsonStrings(gqlObjects) {
    return gqlObjects.map(gqlObject => ({
      name: gqlObject.name,
      value: JSON.stringify(gqlObject.value, null, 2)
    }));
  }

  static writeJsFile(fileName, jsonStrings) {
    const fstream = fs.createWriteStream(fileName);
    fstream.write('// Hey Emacs, this is -*- coding: utf-8 -*-\n');
    fstream.write('/* global require */\n');
    for(let jsonString of jsonStrings) {
      fstream.write('\nexports.' + jsonString.name + ' = ');
      fstream.write(jsonString.value);
      fstream.write(';\n');
    }
  }
}

let gc = new GraphqlCompiler("xxx");
gc.compile();
