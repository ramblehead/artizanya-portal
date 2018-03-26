// Hey Emacs, this is -*- coding: utf-8 -*-

import * as path from 'path';
import * as fs from 'mz/fs';

function flatten(arr: any[]): any[] {
  return arr.reduce<any[]>(
    (flat: any, toFlatten: any) =>
      flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten),
    []);
}

async function readdir(dirPath: string): Promise<string[]> {
  const entries = await fs.readdir(dirPath);
  const files = await Promise.all(
    entries.map(async entry => {
      const entryPath = path.join(dirPath, entry);
      const stat = await fs.stat(entryPath);
      return stat.isDirectory() ? await readdir(entryPath) : entryPath;
    }));
  return flatten(files);
}

readdir('.')
  .then(files => files.forEach(file => console.log(file)))
  .catch(console.error);
