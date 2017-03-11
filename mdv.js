#!/usr/bin/env node

'use strict';

var fs = require('fs');
var util = require('util');

var validator = require('./index.js');

var argv = require('yargs')
    .boolean('debug')
    .alias('d','debug')
    .describe('debug','enable debug mode')
    .help('help')
    .alias('h','help')
    .string('outfile')
    .alias('o','outfile')
    .require(1)
    .strict()
    .argv;

var s = fs.readFileSync(argv._[0],'utf8');
var options = {};
options.source = argv._[0];
var result = validator.validate(s,options);
console.log(util.inspect(result));

var exitCode = 0;
if (result.missingAnchors.length>0) exitCode = 1;

process.exit(exitCode);
