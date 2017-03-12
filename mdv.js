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
	.boolean('save')
	.alias('s','save')
	.describe('save','save intermediary html output')
	.boolean('warnings')
	.alias('w','warnings')
	.describe('warnings','enable warnings')
    .require(1)
    .strict()
    .argv;

var exitCode = 0;
var options = argv;
for (var a of argv._) {
	var s = fs.readFileSync(a,'utf8');
	options.source = a;
	var result = validator.validate(s,options);

	if (options.save) {
		fs.writeFileSync(a+'.html',options.html,'utf8');
		delete options.html;
	}

	console.log(util.inspect(result));

	if (result.missingAnchors.length || result.duplicatedAnchors.length ||
		result.anchorsWithHash.length || result.imagesWithMissingAlt) exitCode = 1;
}

process.exit(exitCode);
