var cosm2 = require('cosm');
        client2 = new cosm2.Cosm('9kJtEv__nPxfA1KFZCA98hX50l-SAKxIWW5OaHpXam4yZz0g'),
        raspi = new cosm2.Feed(cosm2, {id: 87563});

var cosmmemfree = new cosm2.Datastream(client2, raspi, {id: "memfree", queue_size: 10});
var  LoadAvg_1m = new cosm2.Datastream(client2, raspi, {id: "LoadAvg_1m", queue_size: 10});
var  LoadAvg_5m = new cosm2.Datastream(client2, raspi, {id: "LoadAvg_5m", queue_size: 10});

var os = require("os");
var clc = require('cli-color');
var buderus = require("./buderus");
var serialport = require("serialport");
  var SerialPort = serialport.SerialPort; // localize object constructor
  
  var sp = new SerialPort("/dev/ttyUSB0", { 
    baudrate: 57600,
    //parser: serialport.parsers.readline("\n") 
    parser: serialport.parsers.readline("-> ack") 
  });
  

  sp.on("data", function (chunk) {
    chunk = trim(chunk.toString());
    if(chunk.slice(0,2)=="OK"){
      processLine(chunk);
    } else {
      //console.error(">>"+clc.red(chunk));
    }
  });
 
  console.log("RUNNING!");
  
  
function processLine(line) {
    //console.log(line);
	var splits = line.split("\r");
	line = splits[0];
	//console.log("++ "+clc.green(line));
	splits = line.split(" ");
	var lineBuffer = new Buffer((splits.length - 2))
	for(var i = 0; i<splits.length; i++){
	  var c = splits[i];
	  if (i === 0) {
	  
	  } else if (i === 1) {
	    var sender_id=c&0x1F;
	  } else {
	    lineBuffer[(i-2)]=c;
	  }
	}
	if (sender_id === 10) {
		cosmmemfree.addPoint((os.freemem()/1000));
		var la = os.loadavg();
		console.log(la);
		LoadAvg_1m.addPoint(la[0]);
		LoadAvg_5m.addPoint(la[1]);
		//console.log(clc.blue("> Sender HEIZUNG"));
		buderus.processTelegram(lineBuffer);
	} else {
		console.warn(clc.yellow("Sender "+ sender_id +" unbekannt!"));
	}
}
  
function trim(string) {
  return string.replace(/^\s*|\s*$/g, '')
}
