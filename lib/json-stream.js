var util = require('util'),
    Stream = require('stream');

module.exports = function () {
  return new JSONStream();
};

var JSONStream = module.exports.JSONStream = function () {
  this._buffer = '';

  this.writable = true;
  this.readable = true;
  this.paused = false;

  Stream.call(this);
};
util.inherits(JSONStream, Stream);

JSONStream.prototype.write = function (data) {
  var start = 0, stop = 0, chunk, parsed;

  data = data.toString('utf8');

  if (this._buffer) {
    data = this._buffer + data;
  }

  while ((stop = data.indexOf('\n', start + 1)) !== -1) {
    chunk = data.substr(start, stop - start);
    parsed = false;
    try {
      chunk = JSON.parse(chunk);
      parsed = true;
    }
    catch (_) { }

    if (parsed) {
      this.emit('data', chunk);
    }
    start = stop + 1;
  }
  this._buffer = data.substr(start);

  return !this.paused;
};

JSONStream.prototype.pause = function () {
  this.paused = true;
};

JSONStream.prototype.resume = function () {
  this.paused = false;
  this.emit('drain');
};

JSONStream.prototype.end = function () {
  this._buffer = '';
  this.emit('end');
};
