// Hey Emacs, this is -*- coding: utf-8 -*-
/* global module */

const path = require('path');
const fs = require('mz/fs');

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

module.exports = readdir;

// const files = readdir('.');
// files.forEach(file => console.log(file));
