

exports.processTelegram = function (buffer) {
  console.log(buffer);
  
  var sensor1 = buffer.readUInt16LE(0);
  var sensor2 = buffer.readUInt16LE(2);
  var temp = (buffer.readUInt16LE(4)/10);
  var humi = (buffer.readUInt16LE(6)/10);
  
  console.log(sensor1 + "/" + sensor2);
  console.log("Temp: " + temp + "°C - Humi: " + humi + "%");
}