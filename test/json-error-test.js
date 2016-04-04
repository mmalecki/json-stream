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

stream.on('end', function () {
  assert.equal(objects.length, 3);
  assert.deepEqual(objects[0], {"this": "is valid JSON"});
  assert.equal(objects[1].message, 'Unexpected token t');
  assert.deepEqual(objects[2], ["this", "is", "valid", "JSON"]);
});

stream.write('{"this": "is valid JSON"}\n');
try {
  stream.write('{this is not valid JSON]\n');
} catch (e) {
}
stream.write('["this", "is", "valid", "JSON"]\n');
stream.end();
