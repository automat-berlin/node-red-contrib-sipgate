var should = require('should');
var helper = require('node-red-node-test-helper');
var shared = require('../shared.js');
var gatherNode = require('../../../nodes/push/gather.js');
var playNode = require('../../../nodes/push/play.js');
var res = require('../mocks.js').res;
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

  shared.shouldLoadCorrectly(gatherNode, 'gather');

  it('should respond with proper XML', function(done) {
    var flow = [{ id: 'n1', type: 'gather' }];
    var xml = fs.readFileSync('test/resources/xml/gather.xml', 'utf8');
    helper.load(gatherNode, flow, function() {
      var n1 = helper.getNode('n1');
      n1.context().global.set('baseUrl', 'http://example.com');
      n1.on('input', function(msg) {
        should(msg.res._res.responseBody).be.eql(xml.replace('${callbackUrl}', n1.callbackUrl));
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });

  it('should respond with proper XML for custom maxDigits value', function(done) {
    var flow = [{ id: 'n1', type: 'gather', maxDigits: 3 }];
    var xml = fs.readFileSync('test/resources/xml/gather_maxDigits.xml', 'utf8');
    helper.load(gatherNode, flow, function() {
      var n1 = helper.getNode('n1');
      n1.context().global.set('baseUrl', 'http://example.com');
      n1.on('input', function(msg) {
        should(msg.res._res.responseBody).be.eql(xml.replace('${callbackUrl}', n1.callbackUrl));
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });

  it('should respond with proper XML for custom timeout value', function(done) {
    var flow = [{ id: 'n1', type: 'gather', timeout: 10000 }];
    var xml = fs.readFileSync('test/resources/xml/gather_timeout.xml', 'utf8');
    helper.load(gatherNode, flow, function() {
      var n1 = helper.getNode('n1');
      n1.context().global.set('baseUrl', 'http://example.com');
      n1.on('input', function(msg) {
        should(msg.res._res.responseBody).be.eql(xml.replace('${callbackUrl}', n1.callbackUrl));
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });

  it('should respond with proper XML for onAnswer and onHangup callbacks', function(done) {
    var flow = [{ id: 'n1', type: 'gather', onAnswer: true, onHangup: true }];
    var xml = fs.readFileSync('test/resources/xml/gather_callbacks.xml', 'utf8');
    helper.load(gatherNode, flow, function() {
      var n1 = helper.getNode('n1');
      n1.context().global.set('baseUrl', 'http://example.com');
      n1.on('input', function(msg) {
        should(msg.res._res.responseBody).be.eql(xml.replace(/\${callbackUrl}/g, n1.callbackUrl));
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });

  it('should respond with proper XML for soundUrl', function(done) {
    var flow = [{ id: 'n1', type: 'gather', sound: 'url', soundUrl: 'http://example.com/example.wav' }];
    var xml = fs.readFileSync('test/resources/xml/gather_soundUrl.xml', 'utf8');
    helper.load(gatherNode, flow, function() {
      var n1 = helper.getNode('n1');
      n1.context().global.set('baseUrl', 'http://example.com');
      n1.on('input', function(msg) {
        should(msg.res._res.responseBody).be.eql(xml.replace('${callbackUrl}', n1.callbackUrl));
        done();
      });
      n1.receive({ payload: '<call data>', res: res });
    });
  });

  shared.shouldCreateAndRemoveCallbackEndpoint(gatherNode, 'gather');

  var events = ['dtmf', 'answer', 'hangup'];

  events.forEach(function(event) {
    it('should send received ' + event + ' callback payload to the next node', function(done) {
      var flow = [
        { id: 'n1', type: 'gather', onAnswer: true, onHangup: true, wires: [['n2', 'n3'], ['n4'], ['n5']] },
        { id: 'n2', type: 'play', sound: 'url', soundUrl: 'http://example.com/example.wav' },
        { id: 'n3', type: 'helper' },
        { id: 'n4', type: 'helper' },
        { id: 'n5', type: 'helper' },
      ];
      helper.load([gatherNode, playNode], flow, function() {
        var n1 = helper.getNode('n1');
        var n2 = helper.getNode('n2');
        var n3 = helper.getNode('n3');
        var n4 = helper.getNode('n4');
        var n5 = helper.getNode('n5');
        n2.context().global.set('baseUrl', 'http://example.com');
        n3.on('input', function(msg) {
          msg.should.have.property('payload');
          msg.payload.should.have.property('event', event);
          done();
        });
        n4.on('input', function(msg) {
          msg.should.have.property('payload');
          msg.payload.should.have.property('event', event);
          done();
        });
        n5.on('input', function(msg) {
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
