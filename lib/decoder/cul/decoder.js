var sys = require('sys'),
	events = require('events');
var serialport = require("serialport");
var clc = require('cli-color');

var FS20 = require("./decoder-fs20");
var FHT8 = require("./decoder-fht8");
var KS300 = require("./decoder-ks300");

function CUL (device,serialOptions) {
  if ( !(this instanceof CUL) ) {
    return new CUL( device,serialOptions );
  }
  serialOptions = serialOptions || {};
  
  this._culInitialized = false;
  
  var SerialPort = serialport.SerialPort; // localize object constructor
  
  events.EventEmitter.call(this);
  var self = this;
  
  this.sp = new SerialPort("/dev/ttyACM0", { 
    baudrate: 9600,
    parser: serialport.parsers.readline("\n") 
  });
  
  this.sp.on("open",function() {
    console.log(clc.magentaBright(">CUL: Serial Open"));
  	self.emit("open");
  	self.initCUL();
  })
  
  this.sp.on("data",self.processSerial);
}

sys.inherits(CUL, events.EventEmitter);

CUL.prototype.processSerial = function(chunk){
  var str = chunk.toString(),
      firstChar = str.substr(0,1),
      rest = str.substr(1,str.length-2),
      buf;
  var date = new Date();  
  console.log(date.toLocaleDateString()+" "+date.toLocaleTimeString())
  switch(firstChar) {
    case "V": // Version Info
      console.log(clc.bold.magentaBright(">CUL-Version: "+str));
    break;
    case "F": // FS20
      FS20.parse(rest);
    break;
    case "T": // FHT8X
      FHT8.parse(rest);
    break;
    case "K": // KS300
      KS300.parse(rest);
    break;
    default:
      console.log(clc.bold.magentaBright(">CUL: UKN: "+str));
    break;
  }
}

CUL.prototype.initCUL = function() {
  var self = this;
  self.sp.write("X21\n",function(err, results) {
    console.log(clc.magentaBright(">CUL: X21 init done"));
    self._culInitialized = true;
    self.sp.write("V\n");
  });
}

module.exports = CUL;
