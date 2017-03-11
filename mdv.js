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

var exitCode = 0;
var options = {};
for (var a of argv._) {
	var s = fs.readFileSync(a,'utf8');
	options.source = a;
	var result = validator.validate(s,options);
	console.log(util.inspect(result));

	if (result.missingAnchors.length>0) exitCode = 1;
}

process.exit(exitCode);
