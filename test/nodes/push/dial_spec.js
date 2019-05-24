var should = require("should");
var helper = require("node-red-node-test-helper");
var shared = require("../shared.js");
var dialNode = require("../../../nodes/push/dial.js");

helper.init(require.resolve('node-red'));

describe('dial node', function() {

  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(done);
  });

  shared.shouldLoadCorrectly(dialNode, "dial");
});
