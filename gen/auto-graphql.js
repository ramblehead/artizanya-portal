#!/usr/bin/env node

const fs  = require('mz/fs');

const { compileDir } = require('./gqlc');
const { generateTypesForDir,
        extractClientSchema } = require('./gqlt');

if(!fs.existsSync('./schema')) fs.mkdirSync('./schema');

console.log('Extracting client schema...');
extractClientSchema('../src/graphql/client-state.ts',
                    './schema/client.graphql');

console.log('');
console.log('Compiling graphql to gql-js files...');
compileDir('../src');

console.log('');
console.log('Generating typescript types for graphql files...');
generateTypesForDir('../src',
                    './schema/land.json',
                    './schema/client.graphql',
                    '../node_modules/.bin/apollo');
