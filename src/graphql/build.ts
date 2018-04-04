// Hey Emacs, this is -*- coding: utf-8 -*-

import * as path from 'path';
import * as fs from 'mz/fs';

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


// graphqlString = `query GetCharacter($episode: String!) {
//   hero(episode: $episode) {
//     name
//     id
//     appearsIn {
//       title
//     }
//     friends {
//       name
//       id
//       appearsIn {
//         title
//       }
//     }
//   }
// }
// `;

// query, fragment or mutation with parameters
// let regex = /\s*(?:query|mutation)[\s\n\r]+(.+)\([^]*?{[^]*}/
// regex.exec(graphqlString);
