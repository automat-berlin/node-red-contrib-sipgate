var should = require("should");
var helper = require("node-red-node-test-helper");
var shared = require("../shared.js");
var playNode = require("../../../nodes/push/play.js");

helper.init(require.resolve('node-red'));

describe('play node', function() {

  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(done);
  });

  shared.shouldLoadCorrectly(playNode, "play");
});
