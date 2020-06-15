#!/usr/bin/env node

// @ts-check
'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');
var readfiles = require('node-readfiles');
var mdv = require('./index.js');

var argv = require('yargs')
    .usage('testRunner [options] [{path-to-specs}...]')
    .boolean('debug')
    .alias('d','debug')
    .describe('debug','pass debug flag to mdv')
    .string('encoding')
    .alias('e','encoding')
    .default('encoding','utf8')
    .describe('encoding','encoding for input/output files')
    .string('fail')
    .describe('fail','path to specs expected to fail')
    .alias('f','fail')
    .boolean('quiet')
    .alias('q','quiet')
    .describe('quiet','do not show test passes on console, for CI')
    .boolean('stop')
    .alias('s','stop')
    .describe('stop','stop on first error')
    .count('verbose')
    .alias('v','verbose')
    .describe('verbose','increase verbosity')
    .help('h')
    .alias('h', 'help')
    .strict()
    .version()
    .argv;

var red = process.env.NODE_DISABLE_COLORS ? '' : '\x1b[31m';
var green = process.env.NODE_DISABLE_COLORS ? '' : '\x1b[32m';
var yellow = process.env.NODE_DISABLE_COLORS ? '' : '\x1b[33;1m';
var normal = process.env.NODE_DISABLE_COLORS ? '' : '\x1b[0m';

var pass = 0;
var fail = 0;
var failures = [];
var warnings = [];

var options = argv;

function checkOutput(output) {
    var result = true;
    for (var k in output) {
        if (typeof output[k] === 'number') {
            if (output[k] > 0) result = false;
        }
        if (Array.isArray(output[k])) {
            if (output[k].length > 0) result = false;
        }
    }
    return result;
}

function check(file,force,expectFailure) {
    let result = false;
    options.expectFailure = expectFailure;
    options.source = file;

    let components = file.split(path.sep);
    let name = components[components.length-1];

    if ((name.endsWith('.md')) || force) {

        options.warnings = name.startsWith('warn-');

        var srcStr = fs.readFileSync(path.resolve(file),options.encoding);
        var output = {failed:true};
        result = false;
        try {
            output = mdv.validate(srcStr,options);
            result = checkOutput(output);
        }
        catch (ex) {
            console.log(red+'mdv threw an error: '+ex.message);
            warnings.push('mdv threw '+options.source);
            result = false;
        }

        console.log((result ? green : red)+file);
        if (!result) {
            console.log(util.inspect(output));
        }
        if (expectFailure) result = !result;
        if (result) {
            pass++;
        }
        else {
            fail++;
        }

    }
    else {
        result = true;
    }
    return result;
}

function processPathSpec(pathspec,expectFailure) {
    pathspec = path.resolve(pathspec);
    var stats = fs.statSync(pathspec);
    if (stats.isFile()) {
        check(pathspec,true,expectFailure);
    }
    else {
        readfiles(pathspec, {readContents: false, filenameFormat: readfiles.FULL_PATH}, function (err) {
            if (err) console.log(util.inspect(err));
        })
        .then(files => {
            files = files.sort(function(a,b){
                if (a<b) return +1;
                if (a>b) return -1;
                return 0;
            });
            for (var file of files) {
                check(file,false,expectFailure);
            }
        })
        .catch(err => {
            console.log(util.inspect(err));
        });
    }
}

process.exitCode = 1;
console.log('Gathering...');
if ((!argv._.length) && (!argv.fail)) {
    argv._.push('test/pass/');
}
for (let pathspec of argv._) {
    processPathSpec(pathspec,false);
}
if (argv.fail) {
    if (!Array.isArray(argv.fail)) argv.fail = [argv.fail];
    for (let pathspec of argv.fail) {
        processPathSpec(pathspec,true);
    }
}

process.on('exit', function() {
    if (warnings.length) {
        warnings.sort();
        console.log(normal+'\nWarnings:'+yellow);
        for (var w in warnings) {
            console.log(warnings[w]);
        }
    }
    if (failures.length) {
        failures.sort();
        console.log(normal+'\nFailures:'+red);
        for (var f in failures) {
            console.log(failures[f]);
        }
    }
    console.log(normal);
    console.log('Tests: %s passing, %s failing, %s warnings', pass, fail, warnings.length);
    process.exitCode = ((fail === 0) && (pass > 0)) ? 0 : 1;
});
