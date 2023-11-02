'use strict';
var url = require('url');
var util = require('util');

var md = require('markdown-it')({linkify: true, html: true});
//.use(require('markdown-it-lazy-headers'));

var cheerio = require('cheerio');

var exampleValidator = require('./parseExamples.js');

function indexAnyOf(s,a) {
    for (let comp of a) {
        let tmp = s.indexOf(comp);
        if (tmp >= 0) return tmp;
    }
    return -1;
}

function gfmLink(text) {
    text = text.trim().toLowerCase();
    text = text.split("'").join('');
    text = text.split('"').join('');
    text = text.split('.').join('');
    text = text.split('`').join('');
    text = text.split(':').join('');
    text = text.split('/').join('');
    text = text.split('&lt;').join('');
    text = text.split('&gt;').join('');
    text = text.split('<').join('');
    text = text.split('>').join('');
    text = text.split('(').join('');
    text = text.split(')').join('');
    text = text.split(' ').join('-');
    return text.toLowerCase();
}

function define(anchors,name,auto,suffix) {
    var oname = name;
    if (suffix) name = name+'-'+suffix;
    var anchor = anchors.find(function(e,i,a){
        return e.name == name;
    });
    if (anchor) {
        if (auto) {
            define(anchors,oname,auto,suffix ? suffix+1 : 1);
        }
        else {
            anchor.defined++;
        }
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

function validate(s, options) {
    const result = {};
    if (options.source) result.source = options.source;
    result.imagesWithMissingAlt = 0;

    if (options.warnings) {
        result.tooManyBackticks = 0;
        const lines = s.split('\r').join('').split('\n');
        for (let line of lines) {
            if (line.startsWith('````')) {
                result.tooManyBackticks++;
            }
        }
    }
    var html = md.render(s);
    var $ = cheerio.load(html);

    var anchors = [];

    $("a").each(function () {
        var name = $(this).attr('id') || $(this).attr('name');
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

    $("a").each(function () {
        var href = $(this).attr('href');
        if (href) {
            var local = true;
            var u = url.parse(href);
            if (u.protocol || (u.path && u.path.startsWith('/')) || href.startsWith('./') || href.startsWith('../')) local = false;
            if (indexAnyOf(href,['.md','.html','.json','.yaml','.yml'])>=0) local = false; // FIXME buggy for relative links to files like `LICENSE`
            if (local) {
                var localRefNoHash = !href.startsWith('#');
                var ptr = href.replace('#','');
                var anchor = anchors.find(function(e,i,a){
                    // fragment names are case-sensitive: https://www.w3.org/MarkUp/html-spec/html-spec_7.html#SEC7.4
                    return e.name == ptr;
                });
                if (anchor) {
                    anchor.seen++;
                    if (localRefNoHash) anchor.localRefNoHash = true;
                }
                else {
                    anchor = {
                        name: ptr,
                        defined: 0,
                        seen: 1,
                        localRefNoHash: localRefNoHash
                    };
                    anchors.push(anchor);
                }
                if (!$(this).text()) {
                    anchor.emptyText = anchor.emptyText ? anchor.emptyText++ : 1;
                }
            }
        }
    });

    $("img").each(function() {
        if (!$(this).attr('alt')) {
            result.imagesWithMissingAlt++;
        }
    });

    result.missingAnchors = anchors.filter(function(e,i,a){
        return (!e.defined && e.seen && indexAnyOf(e.name,['.md','.html','.json','.yaml','.yml'])<0);
    });

    result.duplicatedAnchors = anchors.filter(function(e,i,a){
        return (e.defined>1);
    });

    result.anchorsWithHash = anchors.filter(function(e,i,a){
        return (e.name.startsWith('#'));
    });

    result.anchorsWithEmptyText = anchors.filter(function(e,i,a){
        return e.emptyText;
    });

    result.localRefNoHash = anchors.filter(function(e,i,a){
        return e.localRefNoHash;
    });

    result.nonParsingExamples = exampleValidator.parseExamples(s,options);

    if (options.warnings) {
        result.codeBlocksWithNoLanguage = 0;
        $("pre > code").each(function(){
            var classes = ($(this).attr('class')||'').split(' ');
            var lang = classes.find(function(e,i,a){
                return e.startsWith('language');
            });
            if (!lang) result.codeBlocksWithNoLanguage++;
        });

        result.anchorsWithNoLinks = anchors.filter(function(e,i,a){
            return (e.defined && !e.seen && !e.auto);
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

