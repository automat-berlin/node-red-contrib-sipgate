module.exports = function(RED) {
  "use strict";
  var xmlbuilder = require('xmlbuilder');

  function GatherNode(config) {
    RED.nodes.createNode(this, config);
    this.onData = config.onData;
    this.maxDigits = config.maxDigits || 1;
    this.timeout = config.timeout || 2000;
    this.playUrl = config.playUrl;
    this.onHangup = config.onHangup;
    var node = this;
    node.on('input', function(msg) {
      var root = xmlbuilder.create('Response').dec('1.0', 'UTF-8');
      var xml = root.ele('Gather', { 'onData': node.onData, 'maxDigits': node.maxDigits, 'timeout': node.timeout });
      if (node.playUrl) {
        xml.ele('Play').ele('Url', {}, node.playUrl);
      }
      if (node.onHangup) {
        root.att('onHangup', node.onHangup);
      }
      msg.payload = xml.end({ pretty: true, indent: '    ' });
      msg.res._res.set('Content-Type', 'application/xml');
      msg.res._res.status(200).send(msg.payload);
    });
  }
  RED.nodes.registerType("gather", GatherNode);
}
