var CUL = require("./lib/cul");
var serialport = require("serialport");
var step = require("step");
var clc = require('cli-color');
var stick = new CUL("/dev/ttyACM0",{baudrate: 9600});
console.log(stick);


stick.on("open",function(){
  console.log("CUL OPEN!");
  stick.on("data",function(data){
  
  })
});
