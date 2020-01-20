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

  shared.shouldCreateAndRemoveCallbackEndpoint(logNode, 'log');
  shared.shouldSendCallbackPayloadToNextNode(logNode, 'log');
});
