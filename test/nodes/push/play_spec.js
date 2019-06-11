var should = require("should");
var helper = require("node-red-node-test-helper");
var shared = require("../shared.js");
var playNode = require("../../../nodes/push/play.js");
var res = require("../mocks.js").res;
var fs = require('fs');

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

  it('should respond with proper XML', function(done) {
    var flow = [{ id: "n1", type: "play", url: "http://example.com/example.wav" }];
    var xml = fs.readFileSync('test/resources/xml/play.xml', 'utf8');
    helper.load(playNode, flow, function() {
      var n1 = helper.getNode("n1");
      n1.on("input", function(msg) {
        should(msg.res._res.responseBody).be.eql(xml);
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });

  it('should respond with proper XML for onHangup callback', function(done) {
    var flow = [{ id: "n1", type: "play", url: "http://example.com/example.wav", onHangup: "http://example.com/callback" }];
    var xml = fs.readFileSync('test/resources/xml/play_onHangup.xml', 'utf8');
    helper.load(playNode, flow, function() {
      var n1 = helper.getNode("n1");
      n1.on("input", function(msg) {
        should(msg.res._res.responseBody).be.eql(xml);
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });
});
