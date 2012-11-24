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

  data = this._buffer + data.toString('utf8');

  var lines = data.split('\n'),
      that = this;

  this._buffer = lines.pop();

  lines.forEach(function(line) {
    try {
      line = JSON.parse(line);
    }
    catch (_) {
      return;
    }
    that.emit('data', line);
  });

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
