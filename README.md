# mdv

A tiny markdown (link) validator

## Usage

````
Options:
  -d, --debug  enable debug mode                                       [boolean]
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
{ missingAnchors:
   [ { name: 'dataTypeType', defined: 0, seen: 1 },
     { name: 'stType', defined: 0, seen: 2 },
     { name: 'securityDefinitions', defined: 0, seen: 1 } ],
  duplicatedAnchors:
   [ { name: 'itemsMaximum', defined: 2, seen: 0 },
     { name: 'headerMaximum', defined: 2, seen: 0 } ] }
````
