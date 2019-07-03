module.exports = function(RED) {
  "use strict";
  var xmlbuilder = require('xmlbuilder');

  function HangupNode(config) {
    RED.nodes.createNode(this, config);
    this.playUrl = config.playUrl;
    var node = this;

    node.on('input', function(msg) {
      var root = xmlbuilder.create('Response').dec('1.0', 'UTF-8');
      if (node.playUrl) {
        root.ele('Play').ele('Url', {}, node.playUrl);
      }
      root.ele('Hangup');
      msg.payload = root.end({ pretty: true, indent: '    ' });
      msg.res._res.set('Content-Type', 'application/xml');
      msg.res._res.status(200).send(msg.payload);
    });
  }
  RED.nodes.registerType("hangup", HangupNode);
}
