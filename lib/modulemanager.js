//var config = require("../config.json");

var fs = require("fs");

var _modules = {};

exports.init = function(cb) {
  readDir(__dirname+"/modules");
  cb();
}

exports.modules = function() {
  return _modules;
}

exports.getModule = function(modulename) {
  return _modules[modulename].module;
}

exports.getEventHandler = function(modulename) {
  return _modules[modulename].eventhandler;  
}

function readDir(dir){
  var files = fs.readdirSync(dir);
  files.forEach(function(file){
    var filePath = dir + "/" + file;
    var stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      readDir(filePath);
    } else if (file === "module.json") {
      var moduleInfo = require(filePath);
      _modules[moduleInfo.name] = {
        type: moduleInfo.type,
        module: require(dir+"/module.js")
      };
      
      if (_modules[moduleInfo.name].module.initEventHandler) {
        _modules[moduleInfo.name].eventhandler = _modules[moduleInfo.name].module.initEventHandler();
      }
    }
  })
  return;
}
