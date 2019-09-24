var should = require('should');
var helper = require('node-red-node-test-helper');
var shared = require('../shared.js');
var rejectNode = require('../../../nodes/push/reject.js');
var res = require('../mocks.js').res;
var fs = require('fs');

helper.init(require.resolve('node-red'));

describe('reject node', function() {
  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(done);
  });

  shared.shouldLoadCorrectly(rejectNode, 'reject');

  var reasons = ['rejected', 'busy'];

  reasons.forEach(function(reason) {
    it('should respond with proper XML for reason ' + reason, function(done) {
      var flow = [{ id: 'n1', type: 'reject', reason: reason }];
      var xml = fs.readFileSync(`test/resources/xml/reject_${reason}.xml`, 'utf8');
      helper.load(rejectNode, flow, function() {
        var n1 = helper.getNode('n1');
        n1.on('input', function(msg) {
          should(msg.res._res.responseBody).be.eql(xml);
          done();
        });
        n1.receive({ payload: '<call data>', res: res });
      });
    });
  });

  it('should respond with proper XML when sound URL is provided', function(done) {
    var flow = [
      { id: 'n1', type: 'reject', reason: 'rejected', sound: 'url', soundUrl: 'http://example.com/example.wav' },
    ];
    var xml = fs.readFileSync('test/resources/xml/reject_soundUrl.xml', 'utf8');
    helper.load(rejectNode, flow, function() {
      var n1 = helper.getNode('n1');
      n1.context().global.set('baseUrl', 'http://example.com');
      n1.on('input', function(msg) {
        should(msg.res._res.responseBody).be.eql(xml.replace(/\${callbackUrl}/g, n1.callbackUrl));
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });
});
