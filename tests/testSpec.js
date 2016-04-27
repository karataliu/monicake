var conf      = require('./conf.json');
var testUtils = require('./testUtils');
var chai      = require("chai");
var assert    = chai.assert;
chai.use(require("chai-as-promised"));

function createMonitoringServer(rgName, prefix, mock){
  if(mock)
    return Promise.resolve(
    { serverInternalIp: '192.168.0.5',
      serverPublicEndpoint: 'http://doliumtmolvecaqnwzmsmon.southeastasia.cloudapp.azure.com/zab/' });

  var template = require('../azuredeployMonitoringServer.json');
  var templateParameters = {
    "monitorVmName": {
      "value": prefix + "mon"
    },
    "storageAccount": {
      "value": prefix + "sto"
    },
    "virtualNetworkName":{
      "value": prefix + "vnet"
    },
    "subnetName":{
      "value": "default"
    },
    "password":{
      "value": "testPass&"
    }
  };

  return testUtils.createDeployment(rgName, template, templateParameters)
    .then(function(res){
      var outputs = res.properties.outputs;
      return {
        "serverInternalIp"      : outputs.serverInternalIp.value,
        "serverPublicEndpoint"  : outputs.serverPublicEndpoint.value
      };
    });
}

function createMonitoringAgentsByVnet(rgName, prefix, serverIp, mock){
  if(mock){
    return Promise.resolve();
  }
  
  var template = require('../azuredeployMonitoringAgentByVnet.json');
  var templateParameters = {
    "virtualNetworkName":{
      "value": prefix + "vnet"
    },
    "subnetName":{
      "value": "default"
    },
    "serverIp":{
      "value": serverIp
    }
  };

  return testUtils.createDeployment(rgName, template, templateParameters)
    .then(function(res){
      console.log(res);
    });
}

describe('Step Test', function() {
  var resourceGroup;
  var prefix;

  var serverInternalIp;
  var serverPublicEndpoint;

  it('CreateTestEnv', function () {
    this.timeout(1000*250);
    var t1 = assert.isFulfilled(testUtils.createTestEnv(1));
    return Promise.all([
      t1.then(console.log),
      t1.then(function(dat){
        resourceGroup = dat.resourceGroup;
        prefix = dat.prefix;
        assert(prefix.startsWith(conf.prefix), "prefix not starts with expected");
        assert(resourceGroup.startsWith(conf.prefix), "rg not starts with expected");
      })
    ]);
  });

  it('CreateMonitoringServer', function () {
    assert(prefix, "Prefix should not be empty");
    assert(resourceGroup, "resourceGroup should not be empty");
    this.timeout(1000*650);
    var t1 = assert.isFulfilled(createMonitoringServer(resourceGroup, prefix,1));
    return Promise.all([
      t1.then(console.log),
      t1.then(function(dat){
        serverInternalIp = dat.serverInternalIp;
        serverPublicEndpoint = dat.serverPublicEndpoint;
      })
    ]);
  });

  it('CreateMonitoringAgents', function () {
    assert(serverInternalIp, "serverInternalIp should not be empty");
    assert(serverPublicEndpoint, "serverPublicEndpoint should not be empty");
    this.timeout(1000*550);
    var t1 = assert.isFulfilled(createMonitoringAgentsByVnet(resourceGroup, prefix, serverInternalIp,1));
    return t1;
  });

  it('VerifyPage', function(){
    
  });
});

xdescribe('Work', function() {
    it('a1', function () {
      assert.equal(1,1);
      //assert.equal(1,2);
      it('b1',function(){
        assert.equal(2,3);
      });
    });
   // assert.equal(3,4);
});