'use strict';
var url = require('url');

var md = require('markdown-it')({linkify: true, html: true});
//.use(require('markdown-it-lazy-headers'));

var cheerio = require('cheerio');

function validate(s,options) {
	var html = md.render(s);
	var $ = cheerio.load(html);

	var anchors = [];

	var elements = $("a").each(function () {
		var name = $(this).attr('name');
		if (name) {
			var anchor = anchors.find(function(e,i,a){
				return e.name == name;
			});
			if (anchor) {
				anchor.defined++;
			}
			else {
				anchor = {
					name: name,
					defined: 1,
					seen: 0
				};
				anchors.push(anchor);
			}
		}
	});

	var elements = $("a").each(function () {
		var href = $(this).attr('href');
		if (href) {
			var local = true;
			var u = url.parse(href);
			if (u.protocol) local = false;
			if (local) {
				var ptr = href.replace('#','');
				var anchor = anchors.find(function(e,i,a){
					// fragment names are case-sensitive: https://www.w3.org/MarkUp/html-spec/html-spec_7.html#SEC7.4
					return e.name == ptr;
				});
				if (anchor) {
					anchor.seen++;
				}
				else {
					anchor = {
						name: ptr,
						defined: 0,
						seen: 1
					};
					anchors.push(anchor);
				}
			}
		}
	});

	var result = {};
	if (options.source) result.source = options.source;
	result.missingAnchors = anchors.filter(function(e,i,a){
		return (e.defined==0 && e.seen>0);
    });
	result.duplicatedAnchors = anchors.filter(function(e,i,a){
		return (e.defined>1);
    });

	return result;
}

module.exports = {
	validate : validate
};

