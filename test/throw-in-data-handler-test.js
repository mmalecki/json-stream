var assert = require('assert'),
    jsonStream = require('../');

var stream = jsonStream();

stream.on('data', function (chunk) {
  throw new Error('Error');
});

assert.throws(function () {
  stream.write(JSON.stringify({ a: 42 }) + '\n');
});

stream.end();
