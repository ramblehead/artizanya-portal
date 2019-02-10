#!/usr/bin/env node
// Hey Emacs, this is -*- coding: utf-8 -*-

// https://github.com/Microsoft/TypeScript/wiki/JsDoc-support-in-JavaScript

const fs  = require('mz/fs');

// const { compileDir } = require('./gqlc');
const { generateTypesForDir,
        extractClientSchema } = require('./gqlt');

if(!fs.existsSync('./schema')) fs.mkdirSync('./schema');

console.log('Extracting local schema...');
extractClientSchema('../src/graphql/local/state.js',
                    './schema/local-state.graphql');

// console.log('');
// console.log('Compiling graphql to gql-js files...');
// compileDir('../src');

console.log('');
console.log('Generating typescript types for graphql files...');
generateTypesForDir('../src',
                    './schema/land.json',
                    './schema/local-state.graphql',
                    'npx --no-install apollo');
