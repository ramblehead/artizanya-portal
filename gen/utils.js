// Hey Emacs, this is -*- coding: utf-8 -*-
/* global require, exports */

const path = require('path');
const fs = require('mz/fs');

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

exports.upperCaseInitial = upperCaseInitial;
exports.lowerCaseInitial = lowerCaseInitial;
exports.flatten = flatten;
exports.readdirRecursiveSync = readdirRecursiveSync;
