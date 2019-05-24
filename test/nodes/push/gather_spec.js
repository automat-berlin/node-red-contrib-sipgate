var should = require("should");
var helper = require("node-red-node-test-helper");
var shared = require("../shared.js");
var gatherNode = require("../../../nodes/push/gather.js");

helper.init(require.resolve('node-red'));

describe('gather node', function() {

  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(done);
  });

  shared.shouldLoadCorrectly(gatherNode, "gather");
});
