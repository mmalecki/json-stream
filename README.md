# json-stream [![Build Status](https://secure.travis-ci.org/mmalecki/json-stream.png?branch=master)](http://travis-ci.org/mmalecki/json-stream)
New line-delimeted JSON parser with a stream interface.

## Installation

    npm install json-stream

## Usage
```js
var JSONStream = require('json-stream');

var stream = JSONStream();

stream.on('data', function (chunk) {
  console.dir(chunk);
});
stream.write('{"a":');
stream.write('42}\n');
stream.write('{"hel');
stream.write('lo": "world"}\n');
```

Will output:
```
{ a: 42 }
{ hello: 'world' }
```
