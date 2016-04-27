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
    }).then(function(res){ return res.name; });
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
  return createDeployment(rgName, template, templateParameters);
}

function createTestOutput(rgName){
  var template = require('./templates/testOutput.json');
  return createDeployment(rgName, template, {});
}

function createTestOutput1(){
  return { id: '/subscriptions/c4528d9e-c99a-48bb-b12d-fde2176a43b8/resourceGroups/doliumt2016-04-26T10-20-04.255Z/providers/Microsoft.Resources/deployments/testDeployment',
  name: 'testDeployment',
  properties: 
   { provisioningState: 'Succeeded',
     correlationId: 'f23cde7b-1d93-4dd8-b876-c492b90466b8',
     outputs: { prefix: {"value":2}, resourceGroup: {"value":3} },
     providers: [],
     dependencies: [],
     parameters: {},
     mode: 'Incremental' } };
}

function createTestResourceGroup1()
{
  return Promise.resolve("doliumt2016-04-26T10-20-04.255Z");
}

exports.createTestEnv = function(){
  //return createTestResourceGroup().then(createTestEnvDeployment).then(function(res){
  return createTestResourceGroup1().then(createTestOutput1).then(function(res){
    var outputs = res.properties.outputs;
    var g1={
      "resourceGroup" : outputs.resourceGroup.value,
      "prefix"        : outputs.prefix.value
    };
    return Promise.resolve(g1);
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