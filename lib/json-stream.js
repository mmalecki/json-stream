var util = require('util'),
    TransformStream = require('stream').Transform;

module.exports = ParseStream


module.exports.JSONStream = ParseStream
module.exports.parse = ParseStream
module.exports.stringify = StringifyStream

function ParseStream() {
  if(!(this instanceof ParseStream)) return new ParseStream

  this._buffer = '';

  TransformStream.call(this, {
    objectMode: true // wtf node, why do I even need it?!
  });
};
util.inherits(ParseStream, TransformStream);

ParseStream.prototype._transform = function (data, encoding, callback) {
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


function StringifyStream() {
  if(!(this instanceof StringifyStream)) return new StringifyStream

  TransformStream.call(this, {
    objectMode: true
  });
};
util.inherits(StringifyStream, TransformStream);

StringifyStream.prototype._transform = function (object, encoding, callback) {
  this.push(new Buffer(JSON.stringify(object)+'\n', 'utf8'))
  callback();
};

