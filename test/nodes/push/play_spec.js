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
      n1.context().global.set('baseUrl', 'http://example.com');
      n1.on("input", function(msg) {
        should(msg.res._res.responseBody).be.eql(xml);
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });

  it('should respond with proper XML for onAnswer and onHangup callbacks', function(done) {
    var flow = [{ id: "n1", type: "play", url: "http://example.com/example.wav", onAnswer: true, onHangup: true }];
    var xml = fs.readFileSync('test/resources/xml/play_callbacks.xml', 'utf8');
    helper.load(playNode, flow, function() {
      var n1 = helper.getNode("n1");
      n1.context().global.set('baseUrl', 'http://example.com');
      n1.on("input", function(msg) {
        should(msg.res._res.responseBody).be.eql(xml.replace(/\${callbackUrl}/g, n1.callbackUrl));
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });

  it('should create callback endpoint');
  it('should remove callback endpoint on close');
  it('should send received callback payload to the next node');
});
