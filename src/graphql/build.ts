// Hey Emacs, this is -*- coding: utf-8 -*-

import * as path from 'path';
import * as fs from 'mz/fs';

import * as XRegExp from 'xregexp';
import gql from 'graphql-tag';

function flatten(arr: any[]): any[] {
  return arr.reduce(
    (flat: any, toFlatten: any) =>
      flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten),
    []);
}

function graphqlFiles(files: string[]): string[] {
  return files.reduce<string[]>(
    (gfs: string[], f: string) =>
      /\.graphql$/.test(f) ? gfs.concat(f) : gfs,
    []);
}

async function readdir(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir);
  const files = await Promise.all(
    entries.map(async entry => {
      const entryPath = path.join(dir, entry);
      const stat = await fs.stat(entryPath);
      return stat.isDirectory() ? await readdir(entryPath) : entryPath;
    }));
  return flatten(files);
}

async function compileGraphql(file: string) {
  const graphqlString = await fs.readFile(file, 'utf8');
  let gqlJson = gql(graphqlString);
  // gqlJson.loc.toJSON = () => ({...gqlJson.loc});
  const jsonString = JSON.stringify(gqlJson, null, 2);

  const fileBase = path.basename(file, path.extname(file));
  const filePath = path.dirname(file);
  const jsonFile = path.join(filePath, fileBase + '.js');

  console.log(jsonFile);
  await fs.writeFile(jsonFile, jsonString);
}

async function main() {
  const files = graphqlFiles(await readdir('.'));
  // for(const file of files) console.log(file);
  // files.forEach(file => console.log(file));
  await Promise.all(files.map(async file => await compileGraphql(file)));
}

main().catch(console.error);

// readdir('.')
//   .then(files => {
//     files.forEach(file => console.log(file));
//     console.log('\n=====\n');
//     graphqlFiles(files).forEach(file => console.log(file));
//   })
//   .catch(console.error);


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

declare module 'xregexp' {
  function matchRecursive(
    str: string,
    left: string,
    right: string,
    flags: string,
    options: {
      valueNames: string[],
      escapeChar?: string
    }): { name: string, value: string, start: number, end: number }[];
}

const mr = XRegExp.matchRecursive(graphqlString, '{', '}', 'g', {
  valueNames: ['between', 'left', 'match', 'right']
});

let graphqlOps: string[] = [];

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

// see https://stackoverflow.com/questions/546433/regular-expression-to-match-outer-brackets
// and http://xregexp.com/

// query, fragment or mutation with parameters
// let regex = /\s*(?:query|mutation)[\s\n\r]+(.+)[\s\n\r]*\([^]*?{[^]*}/
// regex.exec(graphqlString);
