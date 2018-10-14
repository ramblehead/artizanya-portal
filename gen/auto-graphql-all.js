#!/usr/bin/env node

const { compileDir } = require('./gqlc');
const { generateTypesForDir,
        extractClientSchema } = require('./gqlt');

extractClientSchema('../src/graphql/client-state.ts',
                    './graphql/client-schema.graphql');

console.log('Compiling graphql to gql-js files...');
compileDir('../src');

console.log('');
console.log('Generating typescript types for graphql files...');
generateTypesForDir('../src',
                    './graphql/schema-db.json',
                    './graphql/client-schema.graphql',
                    '../node_modules/.bin/apollo');
