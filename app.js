var config = require("./config.json");
var clc = require('cli-color');
var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor

var decoderJeelink = require("./lib/decoder/jeelink");

var jeelinkSerial = new SerialPort(config.serials.jeelink.port, { 
    baudrate: config.serials.jeelink.baud,
    //parser: serialport.parsers.readline("\n") 
    parser: serialport.parsers.readline("-> ack") 
});

console.log(clc.blue.bold("Starting..."));
jeelinkSerial.on("data", decoderJeelink.processData);
