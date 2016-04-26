// Testing util using default account.

var conf        = require('./conf.json');
var utils       = require('azure-cli/lib/util/utils');
var profile     = require("azure-cli/lib/util/profile");
var client      = utils.createResourceClient(profile.current.getSubscription());

exports.createTestResourceGroup = function(name){
    if (name === undefined){
        // generate from current time.
        name = new Date().toISOString().replace(new RegExp(':','g'),'-');
    }

    var rgName  = conf.prefix + name;
    var tags    = {};
    tags[conf.tagName] = '1';

    var parameters = {
        "location"  : conf.location,
        "tags"      : tags
    };

    console.log("Creating resource group %s at location %s.", rgName, conf.location);
    client.resourceGroups.createOrUpdate(rgName, parameters, function(err, resourceGroup){
        if(err){
            console.log(err);
        }
        
        console.log(resourceGroup);
    });
};

exports.listTestResourceGroups = function(callback){
    // console.log("Listing resource groups with tag " + conf.tagName);
    client.resourceGroups.list({"filter":"tagname eq '" + conf.tagName + "'"}, function(err, list){
        if(callback){
            callback(err, list);
        }else {
            console(err, list);
        }
    });
};