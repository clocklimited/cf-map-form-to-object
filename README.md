# cf-map-form-to-object

Map form field values onto object properties, via matching form field and schema property names

[![Build Status](https://travis-ci.com/clocklimited/cf-map-form-to-object.svg?branch=master)](https://travis-ci.com/clocklimited/cf-map-form-to-object)

## Installation

    npm install --save cf-map-form-to-object

## Usage

```js
var mapFormToObject = require('cf-map-form-to-object')
  , schema = require('./article-schema')()

var formData = mapFormToObject($('form'), schema)
// formData will be an object with any values for schema properties
// that could be extracted from the form by [name] attributes.
```

## Credits
Built by developers at [Clock](http://clock.co.uk).

## Licence
Licensed under the [New BSD License](http://opensource.org/licenses/bsd-license.php)
