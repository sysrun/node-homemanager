var config = require("../../../config.json");

var cosm = require('cosm');
var client = new cosm.Cosm(config.cosm.zitronenwaechter.apikey);
var feed = new cosm.Feed(cosm, {id: config.cosm.zitronenwaechter.feedid});

var cosmTemp = new cosm.Datastream(client, feed, {id: "Temperatur"}),
    cosmHumi = new cosm.Datastream(client, feed, {id: "Luftfeuchte"});


exports.processTelegram = function (buffer) {
  console.log(buffer);
  
  var sensor1 = buffer.readUInt16LE(0);
  var sensor2 = buffer.readUInt16LE(2);
  var temp = (buffer.readUInt16LE(4)/10);
  var humi = (buffer.readUInt16LE(6)/10);
  
  cosmTemp.addPoint(temp);
  cosmHumi.addPoint(humi);

  console.log(sensor1 + "/" + sensor2);
  console.log("Temp: " + temp + "°C - Humi: " + humi + "%");
}