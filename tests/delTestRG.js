var testUtils   = require('./testUtils');

testUtils.listTestResourceGroups().then(function(list){
    for(var rg in list)
        console.log("azure group delete '%s' -q >/dev/null &",list[rg].name);
});