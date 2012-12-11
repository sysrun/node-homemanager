var clc = require('cli-color');

var _commands = {
  "00" : "OFF",
  "11" : "ON",
  "13" : "DIMUP",
  "14" : "DIMDOWN"
};

exports.parse = function(data) {
  var buf = new Buffer(data,"hex");

  console.log(clc.bold.green(">>FS20: "+data));
  console.log(buf);
  var hcode = data.substr(1,4);
  var addr = buf.slice(2,3);
  var cde = buf.slice(3,4);

  console.log(1111+bcd2number(addr));

  if(cde.readUInt8(0) & 0x20){
    console.log(clc.bold(">>>> DINGS"));
  };
  console.log(clc.bold.green(">>>FS20 - HCODE:"+hcode));
  console.log(clc.bold.green(">>>FS20 - ADDR:"+addr.toString("hex")));
  console.log(clc.bold.green(">>>FS20 - CDE:"+getCommand(cde.toString("hex"))));
}



function getCommand(command) {
  var cmd= _commands[command] || "unknown";
  return cmd + " ("+command+")";
}


function hex2four(v) {
  var r = "";
  v.split("").forEach(function(x) {
    r = r*4+(x-1);
    console.log(x);
    console.log(r);
  });
}

var bcd2number = function(bcd)
{
    var n = 0;
    var m = 1;
    for(var i = 0; i<bcd.length; i+=1) {
        n += (bcd[bcd.length-1-i] & 0x0F) * m;
        n += ((bcd[bcd.length-1-i]>>4) & 0x0F) * m * 10;
        m *= 100;
    }
    return n;
}