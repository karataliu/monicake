// Testing util using default account.

var conf        = require('./conf.json');
var utils       = require('azure-cli/lib/util/utils');
var profile     = require("azure-cli/lib/util/profile");
var client      = utils.createResourceManagerClient(profile.current.getSubscription());


exports.getResourceGroup = function(name, callback){
    client.resourceGroups.get(name, function(err, ca){
        
    })
}

exports.createResourceGroup = function(name, location, callback){
    //client.resourceGroups
}