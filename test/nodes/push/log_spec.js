var should = require('should');
var helper = require('node-red-node-test-helper');
var shared = require('../shared.js');
var logNode = require('../../../nodes/push/log.js');
var res = require('../mocks.js').res;
var fs = require('fs');

helper.init(require.resolve('node-red'));

describe('log node', function() {
  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(done);
  });

  shared.shouldLoadCorrectly(logNode, 'log');

  it('should respond with proper XML for onAnswer/onHangup callbacks', function(done) {
    var flow = [{ id: 'n1', type: 'log', onAnswer: true, onHangup: true }];
    var xml = fs.readFileSync('test/resources/xml/log_callbacks.xml', 'utf8');
    helper.load(logNode, flow, function() {
      var n1 = helper.getNode('n1');
      n1.context().global.set('baseUrl', 'http://example.com');
      n1.on('input', function(msg) {
        should(msg.res._res.responseBody).be.eql(xml.replace(/\${callbackUrl}/g, n1.callbackUrl));
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });

  it('should create callback endpoint and remove it on close', function(done) {
    var flow = [{ id: 'n1', type: 'log', onAnswer: true, onHangup: true }];
    helper.load(logNode, flow, function() {
      var n1 = helper.getNode('n1');
      helper
        .request()
        .post(n1.callbackUrl)
        .expect(200)
        .end(done);
      n1.on('close', function() {
        helper
          .request()
          .post(n1.callbackUrl)
          .expect(404)
          .end(function(err, res) {
            if (err) return done(err);
          });
      });
    });
  });

  it('should respond with HTTP 200 to callback request');
  it('should send received callback payload to the next node');
});
