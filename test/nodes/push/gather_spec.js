var should = require("should");
var helper = require("node-red-node-test-helper");
var shared = require("../shared.js");
var gatherNode = require("../../../nodes/push/gather.js");
var res = require("../mocks.js");
var fs = require('fs');

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

  it('should respond with proper XML', function(done) {
    var flow = [{ id: "n1", type: "gather", onData: "http://example.com/dtmf" }];
    var xml = fs.readFileSync('test/resources/xml/gather.xml', 'utf8');
    helper.load(gatherNode, flow, function() {
      var n1 = helper.getNode("n1");
      n1.on("input", function(msg) {
        should(msg.res._res.responseBody).be.eql(xml);
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });

  it('should respond with proper XML for custom maxDigits value', function(done) {
    var flow = [{ id: "n1", type: "gather", onData: "http://example.com/dtmf", maxDigits: 3 }];
    var xml = fs.readFileSync('test/resources/xml/gather_maxDigits.xml', 'utf8');
    helper.load(gatherNode, flow, function() {
      var n1 = helper.getNode("n1");
      n1.on("input", function(msg) {
        should(msg.res._res.responseBody).be.eql(xml);
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });

  it('should respond with proper XML for custom timeout value', function(done) {
    var flow = [{ id: "n1", type: "gather", onData: "http://example.com/dtmf", timeout: 10000 }];
    var xml = fs.readFileSync('test/resources/xml/gather_timeout.xml', 'utf8');
    helper.load(gatherNode, flow, function() {
      var n1 = helper.getNode("n1");
      n1.on("input", function(msg) {
        should(msg.res._res.responseBody).be.eql(xml);
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });

  it('should respond with proper XML for onHangup callback', function(done) {
    var flow = [{ id: "n1", type: "gather", onData: "http://example.com/dtmf", onHangup: "http://example.com/callback" }];
    var xml = fs.readFileSync('test/resources/xml/gather_onHangup.xml', 'utf8');
    helper.load(gatherNode, flow, function() {
      var n1 = helper.getNode("n1");
      n1.on("input", function(msg) {
        should(msg.res._res.responseBody).be.eql(xml);
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });

  it('should respond with proper XML for playUrl', function(done) {
    var flow = [{ id: "n1", type: "gather", onData: "http://example.com/dtmf", playUrl: "http://example.com/example.wav" }];
    var xml = fs.readFileSync('test/resources/xml/gather_playUrl.xml', 'utf8');
    helper.load(gatherNode, flow, function() {
      var n1 = helper.getNode("n1");
      n1.on("input", function(msg) {
        should(msg.res._res.responseBody).be.eql(xml);
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });
});
