var assert = require('assert'),
    Stream = require('stream'),
    JSONStream = require('../');

var source = new Stream(),
    dest = JSONStream(),
    chunks = [],
    endCalled = false;

var wantedChunks = [
  { a: 42 },
  { hello: 'world' }
];

dest.on('data', function (c) {
  chunks.push(c);
});

dest.on('end', function () {
  endCalled = true;
});

process.on('exit', function () {
  assert.deepEqual(chunks, wantedChunks);
  assert(endCalled);
});

source.pipe(dest);
source.emit('data', '{"a": 4');
source.emit('data', '2}\nblah');
source.emit('data', '\n{"hello"');
source.emit('data', ': "world"}\n');
source.emit('end');
