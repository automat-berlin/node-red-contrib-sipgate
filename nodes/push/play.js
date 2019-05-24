module.exports = function(RED) {
  "use strict";
  var xmlbuilder = require('xmlbuilder');

  function PlayNode(config) {
    RED.nodes.createNode(this, config);
    this.url = config.url;
    this.onHangup = config.onHangup;
    var node = this;
    node.on('input', function(msg) {
      var root = xmlbuilder.create('Response').dec('1.0', 'UTF-8');
      var xml = root.ele('Play').ele('Url', {}, node.url);
      if (node.onHangup) {
        root.att('onHangup', node.onHangup);
      }
      msg.payload = xml.end({ pretty: true, indent: '    ' });
      node.send(msg);
    });
  }
  RED.nodes.registerType("play", PlayNode);
}
