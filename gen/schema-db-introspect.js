#!/usr/bin/env node

const fs  = require('mz/fs');
const { execSync } = require('child_process');

if(!fs.existsSync('./graphql')) fs.mkdirSync('./graphql');

execSync('../node_modules/.bin/apollo schema:download ' +
         '--endpoint=http://localhost:8529/_db/_system/land ' +
         './graphql/schema-db.json',
         {encoding: 'utf8'});

// let stdout = execSync('../node_modules/.bin/apollo-codegen introspect-schema http://localhost:8529/_db/_system/swd-graphql --output graphql/schema-db.json');
