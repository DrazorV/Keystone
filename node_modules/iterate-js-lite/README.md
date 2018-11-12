# iterate-js-lite

## Description

Base iterate-js library for the full setup see the extension iterate-js library.

## Wiki

[Check out the wiki.](https://github.com/Malexion/iterate-js-lite/wiki)

## Installation

Install package with NPM and add it to your development dependencies:

`npm install iterate-js-lite`

Around 11kb uglified/minified.

## Usage

```javascript
var __ = require('iterate-js-lite');

// Iterate over everything
__.all([ 'hello', 'world' ], function(x) { console.log(x); });
__.all({ 'hello': 1, 'world': 2 }, function(x, y) { console.log(y); });

// Map array or objects
console.log(__.map([ 'hello', 'world' ], function(x) { return x; }));
// Map array or object to either or
console.log(__.map([ 'hello', 'world' ], function(x, y, z) { return { key: y, value: x }; }, { build: {} })); 
// Well suited for arrow functions in ecma 6
console.log(__.map([ 'hello', 'world' ], x => x));
console.log(__.map([ 'hello', 'world' ], (x, y) => ({ key: y, value: x }), { build: {} }));

// Evaluate anything
console.log(__.is.string({}));
console.log(__.is.number(''));
console.log(__.is.def(null)); // Boolean eval
console.log(__.is.set(0)); // Check for null, undefined and NaN

// Generate stuff
console.log(__.gen.password());
console.log(__.gen.password({ // will pull random characters in random order from the following
                    length: 16,
                    alpha: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWYXZ",
                    ints: "0123456789",
                    special: "!@#$%^&*()+~|}{[]\:;?></="
                }));
console.log(__.gen.guid());
var store = {}; // Store them to prevent duplication
console.log(__.gen.guid({ map: store }));
console.log(store);
console.log(__.gen.guid({ seperator: '' })); // Change the seperator

// And more
__.all(__, function(x, y) { console.log(y); });
```
