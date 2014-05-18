var util = require('util'),
    TransformStream = require('stream').Transform;

module.exports = function () {
  return new JSONStream();
};

var JSONStream = module.exports.JSONStream = function () {
  TransformStream.call(this, {
    objectMode: true // wtf node, why do I even need it?!
  });
};
util.inherits(JSONStream, TransformStream);

JSONStream.prototype._transform = function (data, encoding, callback) {
  if (!Buffer.isBuffer(data)) data = new Buffer(data);
  if (this._buffer) {
    data = Buffer.concat([this._buffer, data]);
  }

  var ptr = 0, start = 0;
  while (++ptr <= data.length) {
    if (data[ptr] === 10 || ptr === data.length) {
      try {
        var line = JSON.parse(data.slice(start, ptr));
        this.push(line);
      }
      catch (ex) { }
      if (data[ptr] === 10) start = ++ptr;
    }
  }

  this._buffer = data.slice(start);
  callback();
};
