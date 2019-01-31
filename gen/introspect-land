#!/usr/bin/env node
// Hey Emacs, this is -*- coding: utf-8 -*-

const fs  = require('mz/fs');
const { execSync } = require('child_process');

if(!fs.existsSync('./schema')) fs.mkdirSync('./schema');

//execSync('npx apollo service:download ' +
execSync('../node_modules/.bin/apollo service:download ' +
         '--endpoint=http://localhost:8529/_db/_system/land ' +
         './schema/land.json',
         {encoding: 'utf8'});
