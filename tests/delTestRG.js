var testUtils   = require('./testUtils');
var yesno       = require('yesno');

testUtils.listTestResourceGroups().then(function(list){
    names = list.map(rg => rg.name);
    console.log("The following resource groups are to be deleted:");
    names.forEach(function(name){console.log(name);}); 
    yesno.ask('Are you sure you want to continue?', false, function(ok) {
        if(ok) {
            console.log("Yay!");
        } else {
            console.log("Nope.");
        }
    });
    console.log(32);
});