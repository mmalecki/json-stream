var util = require('util'),
    TransformStream = require('stream').Transform;

module.exports = function () {
  return new JSONStream();
};

var JSONStream = module.exports.JSONStream = function () {
  this._buffer = '';

  TransformStream.call(this, {
    objectMode: true // wtf node, why do I even need it?!
  });
};
util.inherits(JSONStream, TransformStream);

JSONStream.prototype._transform = function (data, encoding, callback) {
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
    that.push(line);
  });

  callback();
};
