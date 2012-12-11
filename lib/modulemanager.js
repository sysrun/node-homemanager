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

function readDir(dir){
  var files = fs.readdirSync(dir);
  files.forEach(function(file){
    var filePath = dir + "/" + file;
    var stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      readDir(filePath);
    } else if (file === "module.json") {
      var moduleInfo = require(filePath);
      console.dir(moduleInfo);
      _modules[moduleInfo.name] = {
        type: moduleInfo.type,
        module: require(dir+"/module.js")
      };
    }
  })
  return;
}
