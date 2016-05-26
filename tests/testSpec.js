var conf      = require('./conf');
var testUtils = require('./testUtils');
var chai      = require("chai");
var assert    = chai.assert;
var phantom = require('phantom');
chai.use(require("chai-as-promised"));

xdescribe('Step Test', function() {
  var resourceGroup;
  var prefix;

  var serverInternalIp;
  var serverPublicEndpoint;

  it('CreateTestEnv', function () {
    this.timeout(1000*550);
    var t1 = assert.isFulfilled(testUtils.createTestEnv());
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
    this.timeout(1000*660);
    var t1 = assert.isFulfilled(createMonitoringServer(resourceGroup, prefix));
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
    this.timeout(1000*550);
    var t1 = assert.isFulfilled(createMonitoringAgentsByVnet(resourceGroup, prefix, serverInternalIp));
    return t1;
  });

  it('VerifyPage', function(){
    this.retries(2);
    assert(serverPublicEndpoint, "serverPublicEndpoint should not be empty");
    this.timeout(1000*20);
    var t1 = assert.isFulfilled(getDiscoveredVms(serverPublicEndpoint));
    return Promise.all([
      t1.then(console.log),
      t1.then(function(list){
        assert.equal(list.length, conf.vmCount + 1);
        assert.deepEqual(list.sort(), createExpectedVmList(prefix).sort());
      })
    ]);
  });
});

describe('One Test', function() {
  var serverPublicEndpoint;

  it('CreateTestEnv', function () {
    this.timeout(1000*560);
    var t1 = assert.isFulfilled(testUtils.createTestEnv());
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

  it('CreateMonitoring', function () {
    assert(prefix, "Prefix should not be empty");
    assert(resourceGroup, "resourceGroup should not be empty");
    this.timeout(1000*1050);
    var t1 = assert.isFulfilled(createMonitoring(resourceGroup, prefix));
    return Promise.all([
      t1.then(console.log),
      t1.then(function(dat){
        serverPublicEndpoint = dat.serverPublicEndpoint;
      })
    ]);
  });

  it('VerifyPage', function(){
    this.retries(2);
    assert(serverPublicEndpoint, "serverPublicEndpoint should not be empty");
    this.timeout(1000*20);
    var t1 = assert.isFulfilled(getDiscoveredVms(serverPublicEndpoint));
    return Promise.all([
      t1.then(console.log),
      t1.then(function(list){
        assert.equal(list.length, conf.vmCount + 1);
        assert.deepEqual(list.sort(), createExpectedVmList(prefix).sort());
      })
    ]);
  });
});

function createExpectedVmList(prefix){
  expected = [prefix + "mon"];
  for(var i = 1;i <= conf.vmCount;i++){
    expected.push(prefix+"vm"+i);
  }

  return expected;
}

function createMonitoring(rgName, prefix){
  var template = require('../azuredeploy.json');
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
    },
    "mysqlPassword":{
      "value": "testPass&1"
    }
  };

  return testUtils.createDeployment(rgName, template, templateParameters)
    .then(function(res){
      var outputs = res.properties.outputs;
      return {
        "serverPublicEndpoint"  : outputs.serverPublicEndpoint.value
      };
    });
}


function createMonitoringServer(rgName, prefix, mock){
  if(mock)
    return Promise.resolve(
    { serverInternalIp: '192.168.0.6',
      serverPublicEndpoint: 'http://doliumtinqkd7damvphumon.westus.cloudapp.azure.com/zab/' });

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
    },
    "mysqlPassword":{
      "value": "testPass&1"
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

function delay(time) {
  return new Promise(function (fulfill) {
    setTimeout(fulfill, time);
  });
}

function getDiscoveredVms(serverEndPoint, mock){
  if(mock)
    return Promise.resolve([ 'doliumtmolvecaqnwzmsvm1', 'doliumtmolvecaqnwzmsmon' ]);
  var page = null;
  var phInstance = null;
  return phantom.create()
      .then(function(instance) {
          phInstance = instance;
          return instance.createPage();
      })
      .then(function(pg) {
          page = pg;
          return page.open(serverEndPoint);
      })
      .then(function(status) {
          if (status !== "success") 
            throw 'page not loaded.';
          return page.evaluate(function() {
                document.querySelector("input[name='name']").value = "Admin";
                document.querySelector("input[name='password']").value = "zabbix";
                document.querySelector("#enter").click();
          });
      })
      .then(function(){
        return delay(3000);
      })
      .then(function(){
            //page.render('result.png');
            return page.evaluate(function() {
                var vms = [];
                [].forEach.call(document.querySelectorAll('.link_menu'), function(span){vms.push(span.innerText);});
                return vms;
            });
        })
        .then(function(rt){
              phInstance.exit();
              return rt;
        });
}