//var config = require('../../../config.json');
var clc = require('cli-color');

/*
var cosm = require('cosm');
var client = new cosm.Cosm(config.cosm.buderus.apikey),
        heizung = new cosm.Feed(cosm, {id: config.cosm.buderus.feedid}),
        kesseltemp = new cosm.Datastream(client, heizung, {id: "Kesseltemperatur", queue_size: 3}),
        kesseltempsoll = new cosm.Datastream(client, heizung, {id: "KesseltempSoll", queue_size: 3}),
        leistungakt = new cosm.Datastream(client, heizung, {id: "LeistungAkt", queue_size: 5}),
        leistungmax = new cosm.Datastream(client, heizung, {id: "LeistungMax", queue_size: 4}),
        wwtemp = new cosm.Datastream(client, heizung, {id: "WWTemp", queue_size: 3}),
        wwtempsoll = new cosm.Datastream(client, heizung, {id: "WWTempSoll", queue_size: 3}),
        aussentemp = new cosm.Datastream(client, heizung, {id: "Aussentemperatur"});
*/


var _busDevices = {
  0x00: "broadcast",
  0x08: "MC10",
  0x09: "BC10",
  0x10: "RC30/35",
  0x11: "Hydr. Weiche",
  0x12: "ZM EED",
  0x13: "Gerät (4x)",
  0x17: "RC20 Heizkreis",
  0x18: "RC20 (8x)",
  0x20: "Mischer (8x)",
  0x28: "Warmwasser (8x)",
  0x30: "Solar (8x)",
  0x38: "Gerät (40x)"
};


exports.processTelegram = function (line) {
  var sender,receiver,telegramtype;

  //console.log(clc.blue(">> buderus.processTelegram"));
  sender = line.readUInt8(0);
  receiver = line.readUInt8(1);
  telegramtype = line.readUInt8(2);
  //console.log(">> " + clc.blue(sender) + " to " + clc.blue(receiver) + " - type:" + clc.blue(telegramtype));
  if (telegramtype === 24) {
  	processType24(line);
  } else if (telegramtype === 25) {
  	processType25(line);
  } else if (telegramtype === 52) {
  	processType52(line);
  } else {
    console.log(">> " + clc.blue(getDevice(sender)) + " to " + clc.blue(getDevice(receiver)) + " - type:" + clc.blue(telegramtype + "("+(telegramtype&0x7F)+")"));
    console.log(line);
  }
}

function processType25(buffer) {
  console.log(clc.blue(">>> buderus.processType25 (0x19)"));
  console.log(buffer);
  
  var at = buffer.readUInt16BE(4);
  	if(at&0x8000){
	   at=(65535 - at)*-1;
	}
	
	at = at/10;
  
  console.log(clc.red("Aussentemp: "+at) + " ("+buffer.slice(4,6).toString('hex')+")");
  //aussentemp.addPoint(at);

}


function processType52(buffer) {
  console.log(clc.blue(">>> buderus.processType52 (0x34)"));
  console.log(buffer);
  var parseState = function(value) {
	  console.log(clc.red("Statebits: "+value));
	  if (value & 0x01) {
	    console.log(">> Tagbetrieb " + clc.green("AN"));
	  } else {
	    console.log(">> Tagbetrieb " + clc.red("AUS"));
	  }
	  if (value & 0x08) {
	    console.log(">> WW Bereitung " + clc.green("AN"));
	  } else {
	    console.log(">> WW Bereitung " + clc.red("AUS"));
	  }

	  if (value & 0x20) {
	    console.log(">> Heizen " + clc.green("AN"));
	  } else {
	    console.log(">> Heizen " + clc.red("AUS"));
	  }
  }
  //wwtempsoll.addPoint(buffer.readUInt16BE(3));
  console.log(clc.red("WW Temperatur soll: "+buffer.readUInt16BE(3)) + " ("+buffer.slice(3,5).toString('hex')+")");
  console.log(clc.red("WW Temp1: "+buffer.readUInt16BE(5)/10) + " ("+buffer.slice(5,7).toString('hex')+")");
  console.log(clc.red("WW Temp2: "+buffer.readUInt16BE(7)/10) + " ("+buffer.slice(7,9).toString('hex')+")");
  parseState(buffer.readUInt8(9));
}

function processType24(buffer) {
  console.log(clc.blue(">>> buderus.processType24 (0x18)"));
  console.log(buffer);
  /*
  kesseltemp.addPoint((buffer.readUInt16BE(5)/10));
  kesseltempsoll.addPoint(buffer.readUInt16BE(3));
  leistungakt.addPoint(buffer.readUInt8(8));
  leistungmax.addPoint(buffer.readUInt8(7));
  wwtemp.addPoint(buffer.readUInt16BE(15)/10);
  */
  console.log(clc.red("Kesseltemperatur Soll: "+buffer.readUInt16BE(3)));
  console.log(clc.red("Kesseltemperatur: "+buffer.readUInt16BE(5)/10));
  console.log(clc.red("Leistung Max: "+buffer.readUInt8(7)) + " ("+buffer.slice(7,8).toString('hex')+")");
  console.log(clc.red("Leistung Aktuell: "+buffer.readUInt8(8)) + " ("+buffer.slice(8,9).toString('hex')+")");
  console.log(clc.red("States: "+buffer.readUInt16BE(10)) + " ("+buffer.slice(10,12).toString('hex')+")");
  stateparser(buffer.readUInt16BE(10));
  console.log(clc.red("??: "+buffer.readUInt8(11)) + " ("+buffer.slice(11,12).toString('hex')+")");
  console.log(clc.red("??: "+buffer.readUInt8(12)) + " ("+buffer.slice(12,13).toString('hex')+")");
  console.log(clc.red("??: "+buffer.readUInt16BE(13)) + " ("+buffer.slice(13,15).toString('hex')+")");
  console.log(clc.red("Temperatur WW: "+buffer.readUInt16BE(15)/10) + " ("+buffer.slice(15,17).toString('hex')+")");
  console.log(clc.red("Temperatur Rückl.: "+buffer.readUInt16BE(17)) + " ("+buffer.slice(17,19).toString('hex')+")");
  console.log(clc.red("Flammenstrom: "+buffer.readUInt16BE(19)/10) + " ("+buffer.slice(19,21).toString('hex')+")");
  console.log(clc.red("Druck: "+buffer.readUInt8(21)/10) + " ("+buffer.slice(21,22).toString('hex')+")");
  console.log(clc.red("Code1: "+buffer.slice(22,23).toString('hex')));
  console.log(clc.red("Code2: "+buffer.slice(23,24).toString('hex')));
}

function stateparser(value) {
  if(value & 0x01){
    console.log(">> Flamme "+clc.green("AN"));
  } else {
    console.log(">> Flamme "+clc.red("AUS"));
  }

  if(value & 0x02){
    console.log(">> Bit 2 "+clc.green("AN"));
  } else {
    console.log(">> Bit 2 "+clc.red("AUS"));
  }

  if(value & 0x04){
    console.log(">> Brenner "+clc.green("AN"));
  } else {
    console.log(">> Brenner "+clc.red("AUS"));
  }

  if(value & 0x08){
    console.log(">> Zündung "+clc.green("AN"));
  } else {
    console.log(">> Zündung "+clc.red("AUS"));
  }
  
  if(value & 0x10){
    console.log(">> Bit 5 "+clc.green("AN"));
  } else {
    console.log(">> Bit 5 "+clc.red("AUS"));
  }

  if(value & 0x20){
    console.log(">> Pumpe HK "+clc.green("AN"));
  } else {
    console.log(">> Pumpe HK "+clc.red("AUS"));
  }
  
  if(value & 0x40){
    console.log(">> Pumpe WW "+clc.green("AN"));
  } else {
    console.log(">> Pumpe WW "+clc.red("AUS"));
  }
  
  if(value & 0x80){
    console.log(">> Zirkulation "+clc.green("AN"));
  } else {
    console.log(">> Zirkulation "+clc.red("AUS"));
  }

  if(value & 0x100){
    console.log(">> Ventil HK1 "+clc.green("AN"));
  } else {
    console.log(">> Ventil HK1 "+clc.red("AUS"));
  }

}


function getDevice(code) {
  if (_busDevices[code])
    return _busDevices[code];
  return "unknown ("+code+")";
}
