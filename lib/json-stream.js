const util = require('util');
const StringDecoder = require('string_decoder').StringDecoder;
const Transform = require('stream').Transform;
util.inherits(JSONStream, Transform);

// Gets \n-delimited JSON string data, and emits the parsed objects
function JSONStream(options) {
  Transform.call(this, { readableObjectMode : true });

  this._buffer = '';
  this._decoder = new StringDecoder('utf8');
  this.async = options && options.async? setImmediate: function (fn) { fn(); };
}

JSONStream.prototype._transform = function(chunk, encoding, cb) {
  this._buffer += this._decoder.write(chunk);
  // split on newlines
  var lines = this._buffer.split(/\r?\n/);
  // keep the last partial line buffered
  this._buffer = lines.pop();
  for (var l = 0; l < lines.length; l++) {
    var line = lines[l];
    this._pushLine(line);
  }
  cb();
};

JSONStream.prototype._pushLine = function(line) {
  var self = this;

  if (line.trim()) {
    try {
      var obj = JSON.parse(line);
    } catch (er) {
      this.async(function () {
        self.emit('error', er);
      });
      return;
    }
    // push the parsed object out to the readable consumer

    this.async(function () {
      self.push(obj);
    });
  }
}

JSONStream.prototype._flush = function(cb) {
  // Just handle any leftover
  var rem = this._buffer.trim();
  this._pushLine(rem);
  this.async(function () {
    cb();
  });
};

module.exports = function (options) {
  return new JSONStream(options);
};
