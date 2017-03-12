'use strict';
var url = require('url');
var util = require('util');

var md = require('markdown-it')({linkify: true, html: true});
//.use(require('markdown-it-lazy-headers'));

var cheerio = require('cheerio');

function gfmLink(text) {
	text = text.trim().toLowerCase();
	text = text.split("'").join('');
	text = text.split('.').join('');
	text = text.split(' ').join('-');
	return text;
	//return text.trim().toLowerCase().replace(/[^\w\- ]+/g, ' ').replace(/\s+/g, '-').replace(/\-+$/, '');
}

function define(anchors,name,auto) {
	var anchor = anchors.find(function(e,i,a){
		return e.name == name;
	});
	if (anchor) {
		if (!auto) anchor.defined++;
	}
	else {
		anchor = {
			name: name,
			defined: 1,
			seen: 0,
			auto: auto
		};
		anchors.push(anchor);
	}
}

function validate(s,options) {
	var html = md.render(s);
	var $ = cheerio.load(html);

	var anchors = [];

	var elements = $("a").each(function () {
		var name = $(this).attr('name');
		if (name) {
			define(anchors,name,false);
		}
	});

	// GFM auto-links
	for (var heading of ["h1","h2","h3","h4","h5","h6"]) {
		var elements = $(heading).each(function() {
			var text = gfmLink($(this).text());
			define(anchors,text,true);
		});
	}

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
				if ($(this).text()) {
					anchor.emptyText = anchor.emptyText ? anchor.emptyText++ : 1;
				}
			}
		}
	});

	var result = {};
	if (options.source) result.source = options.source;
	result.missingAnchors = anchors.filter(function(e,i,a){
		return (!e.defined && e.seen && !e.name.indexOf('.md'));
    });
	result.duplicatedAnchors = anchors.filter(function(e,i,a){
		return (e.defined>1);
    });
	result.anchorsWithHash = anchors.filter(function(e,i,a){
		return (e.name.startsWith('#'));
    });
	if (options.warnings) {
		result.anchorsWithNoLinks = anchors.filter(function(e,i,a){
			return (e.defined && !e.seen && !e.auto);
   		});
		result.anchorsWithEmptyText = anchors.filter(function(e,i,a){
			return (e.emptyText);
   		});
	}

	if (options.save) {
		options.html = html;
	}

	return result;
}

module.exports = {
	validate : validate
};

