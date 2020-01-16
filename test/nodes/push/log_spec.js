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

  var events = ['answer', 'hangup'];

  events.forEach(function(event) {
    it('should send received ' + event + ' callback payload to the next node', function(done) {
      var flow = [
        { id: 'n1', type: 'log', onAnswer: true, onHangup: true, wires: [['n2'], ['n3']] },
        { id: 'n2', type: 'helper' },
        { id: 'n3', type: 'helper' },
      ];
      helper.load(logNode, flow, function() {
        var n1 = helper.getNode('n1');
        var n2 = helper.getNode('n2');
        var n3 = helper.getNode('n3');
        n2.on('input', function(msg) {
          msg.should.have.property('payload');
          msg.payload.should.have.property('event', event);
          done();
        });
        n3.on('input', function(msg) {
          msg.should.have.property('payload');
          msg.payload.should.have.property('event', event);
          done();
        });
        helper
          .request()
          .post(n1.callbackUrl)
          .expect(200)
          .send('event=' + event)
          .end(function(err, res) {
            if (err) return done(err);
          });
      });
    });
  });
});
