var assert = require('assert');
var JSONStream = require('../');

var stream = JSONStream();

var objects = [];

stream.on('data', function (data) {
  objects.push(data);
});

stream.on('error', function (error) {
  objects.push(error);
  assert.equal(error.message, 'Unexpected token t');
});

stream.write('{"this": "is valid JSON"}\n');
stream.write('{this is not valid JSON]\n');
stream.write('["this", "is", "valid", "JSON"]\n');
stream.end();
