#!/usr/bin/env node

const fs  = require('mz/fs');
const { execSync } = require('child_process');

if(!fs.existsSync('./schema')) fs.mkdirSync('./schema');

execSync('../node_modules/.bin/apollo schema:download ' +
         '--endpoint=http://localhost:8529/_db/_system/land ' +
         './schema/land.json',
         {encoding: 'utf8'});
