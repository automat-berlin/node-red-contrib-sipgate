module.exports = function(RED) {
  "use strict";
  var xmlbuilder = require('xmlbuilder');

  function RejectNode(config) {
    RED.nodes.createNode(this, config);
    this.reason = config.reason || "rejected";
    var node = this;
    node.on('input', function(msg) {
      msg.payload = xmlbuilder.create('Response').dec('1.0', 'UTF-8').ele('Reject', { 'reason': node.reason }).end({ pretty: true, indent: '    ' });
      msg.res._res.set('Content-Type', 'application/xml');
      msg.res._res.status(200).send(msg.payload);
    });
  }
  RED.nodes.registerType("reject", RejectNode);
}
