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
