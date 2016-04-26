var testUtil  = require('./testUtils');
var chai      = require("chai");
var assert    = chai.assert;
chai.use(require("chai-as-promised"));
var Promise =require('bluebird');

describe('Group', function() {
    it('CreateEnv', function (done) {
      this.timeout(1000*250);
      assert.isFulfilled(testUtil.createTestEnv()).notify(done);
    });
});

describe('Work', function() {
    it('w1', function () {
      assert.equal(1,1);
    });
});