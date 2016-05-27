Monitoring experimental deployment.

Supported Distros: 
Server: Ubuntu 14.04 LTS
Agent: Ubuntu 14.04 LTS, Ubuntu 16.04 LTS, CentOS 7.1

- azuredeploy.json
This will install the monitor VM to given vnet/subnet, and also install monitoring agent on all vms connected to that vnet/subnet.

[![Deploy to Azure](http://azuredeploy.net/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fkarataliu%2Fmonicake%2Fmaster%2Fazuredeploy.json)

Deployment parameters:

| Parameters            | Description                                                                           |
| -------------         | -------------                                                                         |
| monitorVmName         | The name for the new monitoring server VM to be created.                              |
| storageAccount        | An existing storage account in same resource group, used for storing the new VM.      |
| virtualNetworkName    | The name of vnet where current VMs connects to.                                       |
| subnetName            | The name of subnet where current VMs connects to.                                     |
| username              | The username for the new created monitoring server VM.                                |
| password              | The password for the new created monitoring server VM.                                |
| mysqlHost             | The host for the backend database server, leave 'localhost' for creating a new one.   |
| mysqlDbName           | The database name for monitoring backend database.                                    |
| mysqlUser             | The database username for monitoring backend database.                                |
| mysqlPassword         | The database password for monitoring backend database.                                |

Deployment output

| Output                | Description                                                                       |
| -------------         | -------------                                                                     |
| serverPublicEndpoint  | The frontend endpoint for the monitoring serice(aka monitoring portal).           |


- azuredeployMonitoringServer.json
This will install monitoring server only.

[![Deploy to Azure](http://azuredeploy.net/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fkarataliu%2Fmonicake%2Fmaster%2FazuredeployMonitoringServer.json)

- azuredeployMonitoringAgentByVnet.json
This will install monitoring agents for given vnet/subnet.

[![Deploy to Azure](http://azuredeploy.net/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fkarataliu%2Fmonicake%2Fmaster%2FazuredeployMonitoringServer.json)

- azuredeployMonitoringAgentByVms.json
This will install monitoring agents for given Vms.

[![Deploy to Azure](http://azuredeploy.net/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fkarataliu%2Fmonicake%2Fmaster%2FazuredeployMonitoringAgentByVms.json)




