'use strict';

const fs = require('fs');
const yaml = require('yaml');
const xml2json = require('jgexml/xml2json').xml2json;
const abnf = require('abnf');

function parseExamples(s,options) {

    var result = [];

    let lines = s.split('\r').join('').split('\n');
    let counter = 1;
    let inFence = false;
    let extension = 'txt';
    let example = '';
    let lineStart = 1;
    for (let lineNo in lines) {
        let line = lines[lineNo];
        if (line.startsWith('```')) {
            if (inFence) {
                if ((extension === 'json') || (extension === 'yaml')) {
                    if ((extension === 'json') && (example.startsWith('"'))) {
                        example = '{'+example+'}';
                    }
                    if (extension === 'yaml') {
                        example = example.split('!include').join('#include');
                    }
                    var obj = {};
                    try {
                        obj = yaml.parse(example,{prettyErrors:true});
                        if (extension === 'yaml') {
                            example = yaml.stringify(obj);
                        }
                        else {
                            example = JSON.stringify(obj,null,2);
                        }
                        if (options.debug) console.log(example);
                    }
                    catch (ex) {
                        let entry = {};
                        entry.lineStart = parseInt(lineStart,10);
                        entry.lineEnd = parseInt(lineNo,10);
                        entry.extension = extension;
                        entry.message = ex.message;
                        result.push(entry);
                        return result;
                    }
                }

                if (extension === 'xml') {
                   let obj = xml2json(example);
                   if (options.debug) console.log(JSON.stringify(obj));
                   if (Object.keys(obj).length !== 1) {
                        let entry = {};
                        entry.lineStart = parseInt(lineStart,10);
                        entry.lineEnd = parseInt(lineNo,10);
                        entry.extension = extension;
                        entry.message = 'No root element found';
                        result.push(entry);
                        return result;
                   }
                }

                if (extension === 'abnf') {
                    abnf.Parse(example,function(err,rules){
                        if (err) {
                            let entry = {};
                            entry.lineStart = parseInt(lineStart,10);
                            entry.lineEnd = parseInt(lineNo,10);
                            entry.extension = extension;
                            entry.message = err;
                            result.push(entry);
                            return result;
                        }
                    });
                }

                example = '';
                counter++;
                extension = 'txt';
                inFence = false;
            }
            else {
                inFence = true;
                lineStart = lineNo;
                extension = line.split('`').pop().trim().toLowerCase();
                if (extension === 'yml') extension = 'yaml';
                if (!extension) extension = 'txt';
            }
        }
        else if (inFence) {
            example += line + '\n';
        }
    }
    return result;
}

module.exports = {
    parseExamples : parseExamples
};
