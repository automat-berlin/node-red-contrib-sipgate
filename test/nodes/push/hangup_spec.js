var should = require("should");
var helper = require("node-red-node-test-helper");
var hangupNode = require("../../../nodes/push/hangup.js");

helper.init(require.resolve('node-red'));

describe('hangup node', function() {

  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(done);
  });

  it('should be loaded with proper name', function(done) {
    var flow = [{ id: "n1", type: "hangup", name: "test name" }];
    helper.load(hangupNode, flow, function() {
      var n1 = helper.getNode("n1");
      n1.should.have.property('name', 'test name');
      done();
    });
  });

  it('should return proper payload', function(done) {
    var flow = [{ id: "n1", type: "hangup", name: "hangup", wires: [["n2"]] }, { id: "n2", type: "helper" }];
    helper.load(hangupNode, flow, function() {
      var n2 = helper.getNode("n2");
      var n1 = helper.getNode("n1");
      n2.on("input", function(msg) {
        msg.should.have.property('payload', '<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n    <Hangup/>\n</Response>');
        done();
      });
      n1.receive({ payload: 'not important' });
    });
  });
});
