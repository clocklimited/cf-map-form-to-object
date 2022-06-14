# @clocklimited/cf-map-form-to-object

Map form field values onto object properties, via matching form field and schema property names

[![CircleCI](https://circleci.com/gh/clocklimited/cf-map-form-to-object/tree/master.svg?style=shield)](https://circleci.com/gh/clocklimited/cf-map-form-to-object/tree/master)

## Installation

```
npm install --save @clocklimited/cf-map-form-to-object
npm install --save @clocklimited/schemata
```

## Usage

```js
const mapFormToObject = require('cf-map-form-to-object')
const schema = require('./article-schema')()

var formData = mapFormToObject($('form'), schema)
// formData will be an object with any values for schema properties
// that could be extracted from the form by [name] attributes.
```

## Credits

Built by developers at [Clock](http://clock.co.uk).

## Licence

Licensed under the [New BSD License](http://opensource.org/licenses/bsd-license.php)
