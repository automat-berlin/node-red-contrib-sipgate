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
