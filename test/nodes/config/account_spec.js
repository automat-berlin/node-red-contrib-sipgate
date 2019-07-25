var should = require('should');
var helper = require('node-red-node-test-helper');
var shared = require('../shared.js');
var accountNode = require('../../../nodes/config/account.js');

helper.init(require.resolve('node-red'));

describe('account config node', function() {
  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(done);
  });

  shared.shouldLoadCorrectly(accountNode, 'account');

  it('should return correct credential string', function(done) {
    var flow = [{ id: 'n1', type: 'account' }];
    helper.load(accountNode, flow, function() {
      var n1 = helper.getNode('n1');
      n1.credentials = { email: 'login@example.com', password: 'test1234' };
      should(n1.getCredentialString()).be.eql('bG9naW5AZXhhbXBsZS5jb206dGVzdDEyMzQ=');
      done();
    });
  });
});
