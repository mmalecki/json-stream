var assert = require('assert'),
    JSONStream = require('../');

function write(stream, writes) {
  writes.forEach(function (write) {
    stream.write(write);
  });
  stream.end();
}

function expect(stream, string) {
  var output = '', endCalled = false;
  stream.on('readable', function () {
    var chunk = stream.read();
    if (chunk) {
      output += chunk.toString();
    }
  });
  stream.on('end', function () {
    endCalled = true;
  });
  process.on('exit', function () {
    assert.equal(output, string);
    assert(endCalled);
  });
}

// JSONStream.stringify

var stream = JSONStream.stringify();
expect(stream, '{"a":42}\n');
write(stream, [{ a: 42 }]);

var stream = new JSONStream.stringify();
expect(stream, '{"a":42}\n');
write(stream, [{ a: 42 }]);

stream = JSONStream.stringify();
expect(stream, '{"a":42,"b":1337}\n');
write(stream, [{ a: 42, b: 1337 }]);

stream = JSONStream.stringify();
expect(stream, '{"a":42,"b":1337}\n{"hello":"world"}\n');
write(stream, [ { a: 42, b: 1337 }, { hello: 'world' } ]);