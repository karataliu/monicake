var utils = require('azure-cli/lib/util/utils');
var profile = require("azure-cli/lib/util/profile");
var subscription = profile.current.getSubscription();
var client = utils.createResourceManagerClient(subscription);

exports.getResourceGroup = function(name, callback){
    client.resourceGroups.get(name, function(err, ca){
        
    })
}
