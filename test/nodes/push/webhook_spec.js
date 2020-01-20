var helper = require('node-red-node-test-helper');
var shared = require('../shared.js');
var webhookNode = require('../../../nodes/push/webhook.js');
var logNode = require('../../../nodes/push/log.js');

helper.init(require.resolve('node-red'));

describe('webhook node', function() {
  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(done);
  });

  shared.shouldLoadCorrectly(webhookNode, 'webhook');

  it('should create callback endpoint and remove it on close', function(done) {
    var flow = [{ id: 'n1', type: 'webhook', url: '/webhook', wires: [['n2']] }, { id: 'n2', type: 'log' }];
    helper.load([webhookNode, logNode], flow, function() {
      var n1 = helper.getNode('n1');
      var n2 = helper.getNode('n2');
      n2.context().global.set('baseUrl', 'http://example.com');
      helper
        .request()
        .post(n1.url)
        .expect(200)
        .end(done);
      n1.on('close', function() {
        helper
          .request()
          .post(n1.url)
          .expect(404)
          .end(function(err, res) {
            if (err) return done(err);
          });
      });
    });
  });

  it('should send received payload to the next node', function(done) {
    var flow = [
      { id: 'n1', type: 'webhook', url: '/webhook', wires: [['n2', 'n3']] },
      { id: 'n2', type: 'log' },
      { id: 'n3', type: 'helper' },
    ];
    helper.load([webhookNode, logNode], flow, function() {
      var n1 = helper.getNode('n1');
      var n2 = helper.getNode('n2');
      var n3 = helper.getNode('n3');
      n2.context().global.set('baseUrl', 'http://example.com');
      n3.on('input', function(msg) {
        msg.should.have.property('payload');
        msg.payload.should.have.property('event', 'newCall');
        done();
      });
      helper
        .request()
        .post(n1.url)
        .expect(200)
        .send('event=newCall')
        .end(function(err, res) {
          if (err) return done(err);
        });
    });
  });
});
