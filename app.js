
// CONFIG GLOBAL!
config = require("./config.json");


var clc = require('cli-color');

var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor


modManager = require("./lib/modulemanager");

modManager.init(function(){
  console.log(clc.blue.bold("Starting..."));
  //console.log(modManager.modules())

  var jeelinkSerial = new SerialPort(config.serials.jeelink.port, { 
      baudrate: config.serials.jeelink.baud,
      parser: serialport.parsers.readline("\n") 
  });

  jeelinkSerial.on("data", modManager.getModule("jeelink").processData);

});
