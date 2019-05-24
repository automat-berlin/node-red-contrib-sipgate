var should = require("should");
var helper = require("node-red-node-test-helper");
var shared = require("../shared.js");
var rejectNode = require("../../../nodes/push/reject.js");

helper.init(require.resolve('node-red'));

describe('reject node', function() {

  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(done);
  });

  shared.shouldLoadCorrectly(rejectNode, "reject");
});
