var should = require("should");
var helper = require("node-red-node-test-helper");
var shared = require("../shared.js");
var gatherNode = require("../../../nodes/push/gather.js");
var res = require("../mocks.js").res;
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
    var flow = [{ id: "n1", type: "gather" }];
    var xml = fs.readFileSync('test/resources/xml/gather.xml', 'utf8');
    helper.load(gatherNode, flow, function() {
      var n1 = helper.getNode("n1");
      n1.context().global.set('baseUrl', 'http://example.com');
      n1.on("input", function(msg) {
        should(msg.res._res.responseBody).be.eql(xml.replace('${callbackUrl}', n1.callbackUrl));
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });

  it('should respond with proper XML for custom maxDigits value', function(done) {
    var flow = [{ id: "n1", type: "gather", maxDigits: 3 }];
    var xml = fs.readFileSync('test/resources/xml/gather_maxDigits.xml', 'utf8');
    helper.load(gatherNode, flow, function() {
      var n1 = helper.getNode("n1");
      n1.context().global.set('baseUrl', 'http://example.com');
      n1.on("input", function(msg) {
        should(msg.res._res.responseBody).be.eql(xml.replace('${callbackUrl}', n1.callbackUrl));
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });

  it('should respond with proper XML for custom timeout value', function(done) {
    var flow = [{ id: "n1", type: "gather", timeout: 10000 }];
    var xml = fs.readFileSync('test/resources/xml/gather_timeout.xml', 'utf8');
    helper.load(gatherNode, flow, function() {
      var n1 = helper.getNode("n1");
      n1.context().global.set('baseUrl', 'http://example.com');
      n1.on("input", function(msg) {
        should(msg.res._res.responseBody).be.eql(xml.replace('${callbackUrl}', n1.callbackUrl));
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });

  it('should respond with proper XML for onAnswer and onHangup callbacks', function(done) {
    var flow = [{ id: "n1", type: "gather", onAnswer: true, onHangup: true }];
    var xml = fs.readFileSync('test/resources/xml/gather_callbacks.xml', 'utf8');
    helper.load(gatherNode, flow, function() {
      var n1 = helper.getNode("n1");
      n1.context().global.set('baseUrl', 'http://example.com');
      n1.on("input", function(msg) {
        should(msg.res._res.responseBody).be.eql(xml.replace(/\${callbackUrl}/g, n1.callbackUrl));
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });

  it('should respond with proper XML for playUrl', function(done) {
    var flow = [{ id: "n1", type: "gather", playUrl: "http://example.com/example.wav" }];
    var xml = fs.readFileSync('test/resources/xml/gather_playUrl.xml', 'utf8');
    helper.load(gatherNode, flow, function() {
      var n1 = helper.getNode("n1");
      n1.context().global.set('baseUrl', 'http://example.com');
      n1.on("input", function(msg) {
        should(msg.res._res.responseBody).be.eql(xml.replace('${callbackUrl}', n1.callbackUrl));
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });

  it('should create callback endpoint');
  it('should remove callback endpoint on close');
  it('should respond with HTTP 200 to callback request except dtmf event');
  it('should send received callback payload to the next node');
});
