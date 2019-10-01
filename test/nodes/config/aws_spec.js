var should = require('should');
var helper = require('node-red-node-test-helper');
var shared = require('../shared.js');
var awsNode = require('../../../nodes/config/aws.js');

helper.init(require.resolve('node-red'));

describe('aws config node', function() {
  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(done);
  });

  shared.shouldLoadCorrectly(awsNode, 'aws');
});
