module.exports = function(RED) {
  "use strict";
  var xmlbuilder = require('xmlbuilder');

  function DialNode(config) {
    RED.nodes.createNode(this, config);
    this.target = config.target || 'number';
    this.number = config.number;
    this.anonymous = config.anonymous;
    this.callerId = config.callerId;
    this.onHangup = config.onHangup;
    this.onAnswer = config.onAnswer;
    var node = this;
    node.on('input', function(msg) {
      var root = xmlbuilder.create('Response').dec('1.0', 'UTF-8');
      var xml = root.ele('Dial');
      if (node.anonymous) {
        xml.att('anonymous', true);
      }
      if (node.callerId) {
        xml.att('callerId', node.callerId);
      }
      if (node.target == 'number') {
        xml.ele('Number', {}, node.number);
      } else if (node.target == 'voicemail') {
        xml.ele('Voicemail');
      }
      if (node.onHangup) {
        root.att('onHangup', node.onHangup);
      }
      if (node.onAnswer) {
        root.att('onAnswer', node.onAnswer);
      }
      msg.payload = xml.end({ pretty: true, indent: '    ' });
      node.send(msg);
    });
  }
  RED.nodes.registerType("dial", DialNode);
}
