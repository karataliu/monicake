var Promise     = require('promise');

function ta(callback){
    setTimeout(function(){
        console.log('ta callback');
        callback(undefined, "a");
    }, 500);
}


exports.ta=ta;
tb = Promise.denodeify(ta);

d = tb().catch(function(b){
    console.log("c4 "+b);
}).then(function(a){ console.log("c3 "+a); return 99932;});

console.log(d)

d.done(console.log);