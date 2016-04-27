var testUtil  = require('./testUtils');
var chai      = require("chai");
var assert    = chai.assert;
chai.use(require("chai-as-promised"));

//var outputs = res.properties.outputs;
//return createMonitoringServer(outputs.resourceGroup, outputs.prefix);

function createMonitoringServer(rgName, prefix){
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

  return createDeployment(rgName, template, templateParameters);
}

describe('Group', function() {
    it('CreateEnv', function () {
      this.timeout(1000*250);
      var testEnv = testUtil.createTestEnv();
      //testEnv.then(console.log);
      //testEnv.then(function(dat){assert.equal('b1', dat.prefix);});
      return Promise.all([
        assert.isFulfilled(testEnv),
        testEnv.then(function(dat){
          assert(dat.prefix.toString().startsWith('2'), "not starts with expected");
        }),
        testEnv.then(console.log)
      ]);
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
});