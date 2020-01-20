exports.shouldLoadCorrectly = function(node, type) {
  var helper = require('node-red-node-test-helper');

  it('should be loaded with proper name', function(done) {
    var flow = [{ id: 'n1', type: type, name: 'test name' }];
    helper.load(node, flow, function() {
      var n1 = helper.getNode('n1');
      n1.should.have.property('name', 'test name');
      done();
    });
  });
};

exports.shouldCreateAndRemoveCallbackEndpoint = function(node, type) {
  var helper = require('node-red-node-test-helper');

  it('should create callback endpoint and remove it on close', function(done) {
    var flow = [{ id: 'n1', type: type, onAnswer: true, onHangup: true }];
    helper.load(node, flow, function() {
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
};

exports.shouldSendCallbackPayloadToNextNode = function(node, type) {
  var helper = require('node-red-node-test-helper');
  var events = ['answer', 'hangup'];

  events.forEach(function(event) {
    it('should send received ' + event + ' callback payload to the next node', function(done) {
      var flow = [
        { id: 'n1', type: type, onAnswer: true, onHangup: true, wires: [['n2'], ['n3']] },
        { id: 'n2', type: 'helper' },
        { id: 'n3', type: 'helper' },
      ];
      helper.load(node, flow, function() {
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
};
