var should = require("should");
var helper = require("node-red-node-test-helper");
var shared = require("../shared.js");
var dialNode = require("../../../nodes/push/dial.js");
var res = require("../mocks.js").res;
var fs = require('fs');

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

  it('should respond with proper XML for target number', function(done) {
    var flow = [{ id: "n1", type: "dial", numbers: [{ number: '4915799912345' }] }];
    var xml = fs.readFileSync('test/resources/xml/dial_number.xml', 'utf8');
    helper.load(dialNode, flow, function() {
      var n1 = helper.getNode("n1");
      n1.context().global.set('baseUrl', 'http://example.com');
      n1.on("input", function(msg) {
        should(msg.res._res.responseBody).be.eql(xml);
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });

  it('should respond with proper XML for target voicemail', function(done) {
    var flow = [{ id: "n1", type: "dial", target: 'voicemail' }];
    var xml = fs.readFileSync('test/resources/xml/dial_voicemail.xml', 'utf8');
    helper.load(dialNode, flow, function() {
      var n1 = helper.getNode("n1");
      n1.context().global.set('baseUrl', 'http://example.com');
      n1.on("input", function(msg) {
        should(msg.res._res.responseBody).be.eql(xml);
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });

  it('should respond with proper XML for target number and anonymous flag', function(done) {
    var flow = [{ id: "n1", type: "dial", target: 'number', numbers: [{ number: '4915799912345' }], anonymous: true }];
    var xml = fs.readFileSync('test/resources/xml/dial_anonymous.xml', 'utf8');
    helper.load(dialNode, flow, function() {
      var n1 = helper.getNode("n1");
      n1.context().global.set('baseUrl', 'http://example.com');
      n1.on("input", function(msg) {
        should(msg.res._res.responseBody).be.eql(xml);
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });

  it('should respond with proper XML for target number and callerId', function(done) {
    var flow = [{ id: "n1", type: "dial", target: 'number', numbers: [{ number: '4915799912345' }], callerId: '492111234567' }];
    var xml = fs.readFileSync('test/resources/xml/dial_callerId.xml', 'utf8');
    helper.load(dialNode, flow, function() {
      var n1 = helper.getNode("n1");
      n1.context().global.set('baseUrl', 'http://example.com');
      n1.on("input", function(msg) {
        should(msg.res._res.responseBody).be.eql(xml);
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });

  it('should respond with proper XML for target number and two numbers', function(done) {
    var flow = [{ id: "n1", type: "dial", target: 'number', numbers: [{ number: '4915799912345' }, { number: '492111234567' }] }];
    var xml = fs.readFileSync('test/resources/xml/dial_two_numbers.xml', 'utf8');
    helper.load(dialNode, flow, function() {
      var n1 = helper.getNode("n1");
      n1.context().global.set('baseUrl', 'http://example.com');
      n1.on("input", function(msg) {
        should(msg.res._res.responseBody).be.eql(xml);
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });

  it('should respond with proper XML for target number and onAnswer/onHangup callbacks', function(done) {
    var flow = [{ id: "n1", type: "dial", target: 'number', numbers: [{ number: '4915799912345' }], onAnswer: true, onHangup: true }];
    var xml = fs.readFileSync('test/resources/xml/dial_number_callbacks.xml', 'utf8');
    helper.load(dialNode, flow, function() {
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
