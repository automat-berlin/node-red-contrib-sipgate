var helper = require('node-red-node-test-helper');
var shared = require('../shared.js');
var hangupCallNode = require('../../../nodes/rtcm/hangup-call.js');
var accountNode = require('../../../nodes/config/account.js');
var nock = require('nock');

helper.init(require.resolve('node-red'));

describe('hangup-call node', function() {

  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(done);
  });

  shared.shouldLoadCorrectly(hangupCallNode, 'hangup-call');

  it('should make a proper request to sipgate', function(done) {
    var flow = [
      { id: 'n1', type: 'hangup-call', account: 'n2' },
      { id: 'n2', type: 'account', name: 'test' }
    ];
    var testNodes = [hangupCallNode, accountNode];
    var scope = nock('https://api.sipgate.com')
      .delete('/v2/calls/123456')
      .reply(204);

    helper.load(testNodes, flow, function() {
      var n2 = helper.getNode('n2');
      var n1 = helper.getNode('n1');
      n2.credentials = { email: 'login@example.com', password: 'test1234' };
      n1.on('input', function() {
        done();
      });
      n1.on('close', function() {
        scope.done();
      });
      n1.receive({ payload: { callId: '123456' } });
    });
  });

  it('should warn if call not found', function(done) {
    var flow = [
      { id: 'n1', type: 'hangup-call', account: 'n2' },
      { id: 'n2', type: 'account', name: 'test' }
    ];
    var testNodes = [hangupCallNode, accountNode];
    nock('https://api.sipgate.com')
      .delete('/v2/calls/111111')
      .reply(404);

    helper.load(testNodes, flow, function() {
      var n2 = helper.getNode('n2');
      var n1 = helper.getNode('n1');
      n2.credentials = { email: 'login@example.com', password: 'test1234' };
      n1.on('call:warn', function(call) {
        call.should.be.calledWithExactly('Call with callId 111111 not found.');
        done();
      });
      n1.receive({ payload: { callId: '111111' } });
    });
  });
});
