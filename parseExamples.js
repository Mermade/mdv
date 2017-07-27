var fs = require('fs');
var yaml = require('js-yaml');

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
						obj = yaml.load(example,{json:false});
						if (extension === 'yaml') {
							example = yaml.dump(obj,{lineWidth:-1});
						}
						else {
							example = JSON.stringify(obj,null,2);
						}
						if (options.debug) console.log(example);
					}
					catch (ex) {
						let entry = {};
						entry.lineStart = lineStart;
						entry.lineEnd = lineNo;
						entry.extension = extension;
						entry.message = ex.message;
						result.push(entry);
						return result;
					}
				}
				example = '';
				counter++;
				extension = 'txt';
				inFence = false;
			}
			else {
				inFence = true;
				lineStart = lineNo;
				extension = line.split('`').pop().trim();
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
