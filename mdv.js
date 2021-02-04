#!/usr/bin/env node

// @ts-check
'use strict';

const fs = require('fs');
const util = require('util');
const yaml = require('yaml');
const glob = require("glob");

const validator = require('./index.js');

const argv = require('yargs')
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
    .boolean('yaml')
    .alias('y','yaml')
    .describe('yaml','output in YAML not JSON')
    .require(1)
    .strict()
    .argv;

let exitCode = 0;
const options = argv;


for (let a of argv._) {
    glob(a, options, function (er, files) {
        for (let file of files) {
            const s = fs.readFileSync(a,'utf8');
            options.source = file;
            const result = validator.validate(s,options);

            if (options.save) {
                fs.writeFileSync(a+'.html',options.html,'utf8');
                delete options.html;
            }

            let ok = true;
            for (let p in result) {
                if (typeof result[p] == 'number') {
                    if (result[p]) ok = false
                    else delete result[p];
                }
                else if (Array.isArray(result[p])) {
                    if (result[p].length) ok = false
                    else delete result[p];
                }
                else if (typeof result[p] == 'object') {
                    if (Object.keys(result[p]).length) ok = false
                    else delete result[p];
                }
            }
            if (!ok) {
                if (argv.yaml) {
                    console.log(yaml.stringify(result));
                }
                else {
                    console.log(util.inspect(result,{depth:null}));
                }
                exitCode = 1;
            }
        }
    })
}


process.exit(exitCode);
