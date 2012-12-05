var config = require("../config.json");
var cosm = require('cosm');

exports.getFeed = function(apikey, feedid) {
  var client = new cosm.Cosm(apikey);
  return new cosm.Feed(cosm, {id: feedid});
}
