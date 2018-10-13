#!/usr/bin/env node

const { compileDir } = require('./gqlc');
const { generateTypesForDir } = require('./gqlt');

console.log('Compiling graphql to gql-js files...');
compileDir('../src');

console.log('');
console.log('Generating typescript types for graphql files...');
generateTypesForDir('../src',
                    './graphql/schema-db.json',
                    './graphql/x.graphql',
                    '../node_modules/.bin/apollo');

// let stdout = execSync('../../node_modules/.bin/apollo-codegen generate **/*.graphql --schema schema.json --target typescript --output queries-types.ts');
