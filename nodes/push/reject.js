module.exports = function(RED) {
  "use strict";
  var xmlbuilder = require('xmlbuilder');

  function RejectNode(config) {
    RED.nodes.createNode(this, config);
    this.reason = config.reason || "rejected";
    var node = this;
    node.on('input', function(msg) {
      msg.payload = xmlbuilder.create('Response').dec('1.0', 'UTF-8').ele('Reject', { 'reason': node.reason }).end({ pretty: true, indent: '    ' });
      node.send(msg);
    });
  }
  RED.nodes.registerType("reject", RejectNode);
}
