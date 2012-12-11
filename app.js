
// CONFIG GLOBAL!
config = require("./config.json");


var clc = require('cli-color');

var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor


modManager = require("./lib/modulemanager");

modManager.init(function(){
  console.log("--------------------------");
  console.log(clc.bold("Modules loaded:"));
  for(var mod in modManager.modules()) {
    console.log(">> "+clc.blue.bold(mod)+" "+clc.blue("Type:"+modManager.modules()[mod].type));
  }
  console.log("--------------------------");
  
  console.log(clc.blue.bold("Starting..."));

  var jeelinkSerial = new SerialPort(config.serials.jeelink.port, { 
      baudrate: config.serials.jeelink.baud,
      parser: serialport.parsers.readline("\n") 
  });


  modManager.getEventHandler("jeelink").on("receivefailed",function(data){
    console.log("LINEE::")
    console.log(data);
  });

  jeelinkSerial.on("data", modManager.getModule("jeelink").processData);

});
