var clc = require('cli-color');

exports.parse = function(data) {
  var buf = new Buffer(data,"hex");

  console.log(clc.bold.blue(">>KS300: "+data));
  console.log(buf);
}