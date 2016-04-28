// Testing util using default account.

var conf        = require('./conf.json');
var utils       = require('azure-cli/lib/util/utils');
var profile     = require("azure-cli/lib/util/profile");
var client      = utils.createResourceClient(profile.current.getSubscription());

function createTestResourceGroup(){
    var name    = new Date().toISOString().replace(new RegExp(':','g'),'-');
    var rgName  = conf.prefix + name;
    var tags    = {};
    tags[conf.tagName] = '1';

    var parameters = {
        "location"  : conf.location,
        "tags"      : tags
    };

    console.log("Creating resource group %s at location %s.", rgName, conf.location);
    return new Promise(function(fulfill, reject){
      client.resourceGroups.createOrUpdate(rgName, parameters, function(err, res){
        if(err) reject(err);
        else fulfill(res);
      });
    }).then(function(res){ 
      return res.name;
    });
}

function createDeployment(rgName, template, templateParameters){
  var parameters = {
      "properties": {
          "template" : template,
          "parameters":templateParameters,
          "mode": "Incremental"
      }
  };

  console.log("Creating deployment on resource group %s.", rgName);
  return new Promise(function(fulfill, reject){
    client.deployments.createOrUpdate(rgName, 'testDeployment', parameters, function(err, res){
      if(err) reject(err);
      else fulfill(res);
    });
  });
}

function createTestEnvDeployment(rgName){
  var template = require('./templates/deployCluster.json');
  var templateParameters = require('./templates/deployCluster.parameters.json').parameters;
  templateParameters.prefix = {"value": conf.prefix};
  templateParameters.vmCount = {"value": conf.vmCount};
  return createDeployment(rgName, template, templateParameters);
}

function createTestOutput(rgName){
  var template = require('./templates/testOutput.json');
  return createDeployment(rgName, template, {});
}

exports.createDeployment = createDeployment;

exports.createTestEnv = function(mock){
  if(mock){
    return Promise.resolve(
    { resourceGroup: 'doliumt2016-04-27T09-29-47.419Z',
      prefix: 'doliumtinqkd7damvphu' });
  }
  
  return createTestResourceGroup().then(createTestEnvDeployment).then(function(res){
    var outputs = res.properties.outputs;
    return {
      "resourceGroup" : outputs.resourceGroup.value,
      "prefix"        : outputs.prefix.value
    };
  });
};

exports.listTestResourceGroups = function(){
  return new Promise(function(fulfill, reject){
    client.resourceGroups.list({"filter":"tagname eq '" + conf.tagName + "'"}, function(err, res){
      if(err) reject(err);
      else fulfill(res);
    });
  });
};