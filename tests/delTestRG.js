var testUtils   = require('./testUtils');
var Promise     = require('promise');

var listTestResourceGroups = Promise.denodeify(testUtils.listTestResourceGroups);

listTestResourceGroups().done(function(list){
    for(var rg in list)
        console.log("azure group delete '%s' -q >/dev/null &",list[rg].name);
});