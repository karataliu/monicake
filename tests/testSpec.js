var testUtil  = require('./testUtils');
var assert    = require('chai').assert;

describe('Group', function() {
    it('CreateEnv', function (done) {
      this.timeout(0);
      testUtil.createTestEnv(function(err, res){
        console.log(res);
        done();
      });
  });
});

