module.exports = function(RED) {
  "use strict";
  var xmlbuilder = require('xmlbuilder');

  function HangupNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    node.on('input', function(msg) {
      msg.payload = xmlbuilder.create('Response').dec('1.0', 'UTF-8').ele('Hangup').end({ pretty: true, indent: '    ' });
      node.send(msg);
    });
  }
  RED.nodes.registerType("hangup", HangupNode);
}
