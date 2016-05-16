Monitoring experimental deployment.

- azuredeploy.json
This will install the monitor VM in given vnet/subnet, and also install monitoring agent on all vms in that vnet/subnet.

[![Deploy to Azure](http://azuredeploy.net/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fkarataliu%2Fmonicake%2Fmaster%2Fazuredeploy.json)

- azuredeployMonitoringServer.json
This will install monitoring server only.

- azuredeployMonitoringAgentByVnet.json
This will install monitoring agents for given vnet/subnet.

- azuredeployMonitoringAgentByVms.json
This will install monitoring agents for given Vms.





