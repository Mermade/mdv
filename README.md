# mdv

A tiny markdown validator. It understands [GFM auto-links](https://gist.github.com/asabaylus/3071099), and returns an exitCode of 1 if any rules are violated, making it suitable for use in CI environments.

## Errors

* Undefined internal link targets - `missingAnchors[]`
* Duplicated internal link targets - `duplicatedAnchors[]`
* Anchors containing the # character - `anchorsWithHash[]`
* Links with empty text - `anchorsWithEmptyText[]`
* Images without an `alt` tag - `imagesWithMissingAlt`

## Warnings

* Internal manually-defined anchors with no links pointing to them
* Code-blocks with no language specified - `codeBlocksWithNoLanguage`

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
{ imagesWithMissingAlt: 0,
  source: '../openapi-specification/versions/2.0.md',
  missingAnchors:
   [ { name: 'dataTypeType', defined: 0, seen: 1 },
     { name: 'stType', defined: 0, seen: 2 },
     { name: 'securityDefinitions', defined: 0, seen: 1 } ],
  duplicatedAnchors:
   [ { name: 'itemsMaximum', defined: 2, seen: 0, auto: false },
     { name: 'headerMaximum', defined: 2, seen: 0, auto: false } ],
  anchorsWithHash: [],
  anchorsWithEmptyText: [],
  codeBlocksWithNoLanguage: 1 }
````

