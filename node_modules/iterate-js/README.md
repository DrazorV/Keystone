# iterate-js

## Description

Adds onto the iterate-js-lite base model, __.flow and the __.render.[...] section, along with many new built in classes inside __.lib. 

Mostly experimental functions/classes ill suited for lite will stay in here.

## Wiki

[Check out the wiki.](https://github.com/Malexion/iterate-js/wiki)

## Installation

Install package with NPM and add it to your development dependencies:

`npm install iterate-js`

Around 14kb + 11kb from inheriting iterate-js-lite, uglified and minified.

## Usage

See [iterate-js-lite](https://github.com/Malexion/iterate-js-lite/wiki) for most of the base functionality.

```javascript
var __ = require('iterate-js');

// Iterate over everything
__.all([ 'hello', 'world' ], function(x) { console.log(x); });
__.all({ 'hello': 1, 'world': 2 }, function(x, y) { console.log(y); });

// Map array or objects
console.log(__.map([ 'hello', 'world' ], function(x) { return x; }));
// Map array or object to either or
console.log(__.map([ 'hello', 'world' ], function(x, y, z) { return { key: y, value: x }; }, { build: {} })); 

// Evaluate anything
console.log(__.is.string({}));
console.log(__.is.number(''));
console.log(__.is.def(null)); // Boolean eval
console.log(__.is.set(0)); // Check for null, undefined and NaN
console.log(__.flow([]).def().getProperty('length').def().result); // [].length is defined

// And more
__.all(__, function(x, y) { console.log(y); });
```