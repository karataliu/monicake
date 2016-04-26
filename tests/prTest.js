//var Promise     = require('promise');

function ta(callback){
    setTimeout(function(){
        console.log('ta callback');
        callback(undefined, "a");
    }, 500);
}

//tb = Promise.denodeify(ta);
tb = function(){
    return new Promise(function(ful, err){
        ful(9);
    });
};

function f1(a){ console.log("c3 "+a); return 99932;}

function f2(canshu){
    console.log("c5", canshu);
    return tb();
}

d = tb().catch(function(b){console.log("c4 "+b);}).then(f2);

console.log(d);

//d.done(console.log);