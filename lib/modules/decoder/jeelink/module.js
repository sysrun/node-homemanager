//var config = require("../../../../config.json");


var _nobuderus = config.debug.nobuderus || false;
var _nozitronenwaechter = config.debug.nozitronenwaechter || false;

var clc = require('cli-color');
var events = require('events');
var helper = require("../../../helpers");

var decoderMapping = require("./mapping.json");

if (_nobuderus) {
  decoderMapping["10"] = false;
}

if (_nozitronenwaechter) {
  decoderMapping["11"] = false;
}

var _eventHandler = null;

exports.initEventHandler = function() {
  _eventHandler = new events.EventEmitter();
  return _eventHandler;
}

/*
var cosm = require('cosm');
var os = require("os");
var cosmClient = new cosm.Cosm('9kJtEv__nPxfA1KFZCA98hX50l-SAKxIWW5OaHpXam4yZz0g');
var raspi = new cosm.Feed(cosm, {id: 87563});
var cosmmemfree = new cosm.Datastream(cosmClient, raspi, {id: "memfree", queue_size: 10});
var  LoadAvg_1m = new cosm.Datastream(cosmClient, raspi, {id: "LoadAvg_1m", queue_size: 10});
var  LoadAvg_5m = new cosm.Datastream(cosmClient, raspi, {id: "LoadAvg_5m", queue_size: 10});
*/

exports.processData = function(chunk){
  chunk = helper.trim(chunk.toString());
  if(chunk.slice(0,2)=="OK"){
    //console.log(">>"+clc.green(chunk));
    processLine(chunk);
  } else {
    _eventHandler.emit("receivefailed", new Buffer(chunk));
  }
}

function processLine(line) {
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
  
  if (decoderMapping[sender_id]) {
    console.log(clc.green("Decoder for " + sender_id + " = " + decoderMapping[sender_id]));
    var decoder = require("./" + decoderMapping[sender_id]);
    _eventHandler.emit("received", sender_id, lineBuffer);
    decoder.processTelegram(lineBuffer);
  } else {
    console.warn(clc.yellow("Sender "+ sender_id +" unbekannt!"));
  }

  switch(sender_id){
    case 10:
      if (!_nobuderus) {
        /*
        cosmmemfree.addPoint((os.freemem()/1000));
        var la = os.loadavg();
        LoadAvg_1m.addPoint(la[0]);
        LoadAvg_5m.addPoint(la[1]);
        */
      }
    break;
  }
}