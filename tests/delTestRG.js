var testUtils = require('./testUtils');

testUtils.listTestResourceGroups(function(err, list){
    if(err){
        return;
    }

    for(var rg in list){
        console.log("azure group delete '%s' -q >/dev/null &",list[rg].name);
    }
});