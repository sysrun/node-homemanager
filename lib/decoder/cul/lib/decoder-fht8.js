var clc = require('cli-color');

exports.parse = function(data) {
  var buf = new Buffer(data,"hex");

  console.log(clc.bold.green(">>FHT8: "+data));
  console.log(buf);
}
