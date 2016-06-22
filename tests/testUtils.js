// Testing util using default account.

var conf = require('./conf');
var utils = require('azure-cli/lib/util/utils');
var profile = require("azure-cli/lib/util/profile");
var client = utils.createResourceClient(profile.current.getSubscription());
var crypto = require('crypto');
var exec = require('child_process').exec;

function getGitBranch() {
  return new Promise(function (resolve, reject) {
    exec("git rev-parse --abbrev-ref HEAD", function (error, stdout) {
      if (error) {
        reject(error); return;
      }
      resolve(stdout.trim());
    });
  });
}

function getArtifactsLocation() {
  return getGitBranch().then(function (branch) {
    return "https://raw.githubusercontent.com/karataliu/monicake/" + branch;
  });
}

function createTestResourceGroup(rgName) {
  var tags = {};
  tags[conf.tagName] = '1';

  var parameters = {
    "location": conf.location,
    "tags": tags
  };

  console.log("Creating resource group %s at location %s.", rgName, conf.location);
  return new Promise(function (fulfill, reject) {
    client.resourceGroups.createOrUpdate(rgName, parameters, function (err, res) {
      if (err) reject(err);
      else fulfill(res);
    });
  }).then(function (res) {
    return res.name;
  });
}

function createDeployment(rgName, template, templateParameters) {
  return getArtifactsLocation().then(function (location) {
    if (template.parameters._artifactsLocation) {
      templateParameters._artifactsLocation = {
        "value": location
      };
    }

    var parameters = {
      "properties": {
        "template": template,
        "parameters": templateParameters,
        "mode": "Incremental"
      }
    };

    console.log("Creating deployment on resource group %s.", rgName);
    return new Promise(function (fulfill, reject) {
      client.deployments.createOrUpdate(rgName, 'testDeployment', parameters, function (err, res) {
        if (err) reject(err);
        else fulfill(res);
      });
    });
  });
}

function createTestEnvDeployment(rgName, resourcePrefix) {
  var template = require('../nested/clusterNodes.json');
  var templateParameters = {
    "resourcePrefix": {
      "value": resourcePrefix
    },
    "adminPassword": {
      "value": conf.adminPassword
    },
    "vmCount": {
      "value": conf.vmCount
    }
  };
  return createDeployment(rgName, template, templateParameters);
}

exports.createDeployment = createDeployment;

exports.createTestEnv = function (mock) {
  if (mock) {
    return Promise.resolve(
      {
        resourceGroup: 'doliumt2016-04-27T09-29-47.419Z',
        prefix: 'doliumtinqkd7damvphu'
      });
  }

  var dateStr = new Date().toISOString().replace(new RegExp(':', 'g'), '-');
  var dateHash = crypto.createHash('md5').update(dateStr).digest('hex').substring(0, 2);

  return createTestResourceGroup(conf.resourcePrefix + dateStr).then(function (rg) {
    return createTestEnvDeployment(rg, conf.resourcePrefix + dateHash);
  }).then(function (res) {
    var outputs = res.properties.outputs;
    return {
      "resourceGroup": outputs.resourceGroup.value,
      "prefix": outputs.prefix.value
    };
  });
};

exports.listTestResourceGroups = function () {
  return new Promise(function (fulfill, reject) {
    client.resourceGroups.list({ "filter": "tagname eq '" + conf.tagName + "'" }, function (err, res) {
      if (err) reject(err);
      else fulfill(res);
    });
  });
};

exports.delResourceGroup = function (rgName) {
  console.log("Deleting resource group %s.", rgName);
  return new Promise(function (resolve, reject) {
    return client.resourceGroups.deleteMethod(rgName, function (err, res) {
      if (err) reject(err);
      else resolve(rgName);
    });
  })
    .then(function () {
      console.log("Deleted: %s.", rgName);
    });
};