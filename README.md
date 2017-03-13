# mdv

A tiny markdown validator. It understands [GFM auto-links](https://gist.github.com/asabaylus/3071099), and returns an exitCode of 1 if any rules are violated, making it suitable for use in CI environments.

## Errors

* Undefined internal link targets - `missingAnchors[]`
* Duplicated internal link targets - `duplicatedAnchors[]`
* Anchors containing the # character - `anchorsWithHash[]`
* Links with empty text - `anchorsWithEmptyText[]`
* Images without an `alt` tag - `imagesWithMissingAlt`
* Code-blocks with no language specified - `codeBlocksWithNoLanguage`

## Warnings

* Internal manually-defined anchors with no links pointing to them

## Usage

````
Options:
  -d, --debug  enable debug mode                                       [boolean]
  -s, --save   save intermediary html                                  [boolean]
  -w, --warnings  enable warnings                                      [boolean]
  -h, --help   Show help                                               [boolean]
````

### API

````javascript
var mdv = require('mdv');
var options = {};
var result = mdv.validate(markdownString);
````

### Example output

````javascript
{ source: '../OpenAPI-specification/versions/3.0.md',
  missingAnchors:
   [ { name: 'definitions', defined: 0, seen: 1 },
     { name: 'specification', defined: 0, seen: 1 },
     { name: 'format', defined: 0, seen: 1 },
     { name: 'schema', defined: 0, seen: 1 },
     { name: 'linkObject', defined: 0, seen: 4 },
     { name: 'dataTypeType', defined: 0, seen: 2 },
     { name: 'oasParameters', defined: 0, seen: 2 },
     { name: 'requestBody', defined: 0, seen: 1 },
     { name: 'oasResponses', defined: 0, seen: 2 },
     { name: 'ReferenceObject', defined: 0, seen: 1 } ],
  duplicatedAnchors: [] }
````

