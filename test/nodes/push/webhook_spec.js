var helper = require('node-red-node-test-helper');
var shared = require('../shared.js');
var webhookNode = require('../../../nodes/push/webhook.js');

helper.init(require.resolve('node-red'));

describe('webhook node', function() {

  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(done);
  });

  shared.shouldLoadCorrectly(webhookNode, 'webhook');

  it('should create POST endpoint');
  it('should remove POST endpoint on close');
  it('should send received payload to the next node');
});
