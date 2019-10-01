module.exports = function(RED) {
  'use strict';
  var xmlbuilder = require('xmlbuilder');

  function RejectNode(config) {
    RED.nodes.createNode(this, config);
    this.reason = config.reason || 'rejected';
    this.sound = config.sound;
    this.soundUrl = config.soundUrl;
    this.tts = RED.nodes.getNode(config.tts);
    var node = this;

    node.on('input', function(msg) {
      var root = xmlbuilder.create('Response').dec('1.0', 'UTF-8');
      if (node.sound && node.sound == 'url' && node.soundUrl) {
        root.ele('Play').ele('Url', {}, node.soundUrl);
      } else if (node.sound && node.sound == 'tts' && node.tts.s3url) {
        root.ele('Play').ele('Url', {}, node.tts.s3url);
      }
      root.ele('Reject', { reason: node.reason });
      msg.payload = root.end({ pretty: true, indent: '    ' });
      msg.res._res.set('Content-Type', 'application/xml');
      msg.res._res.status(200).send(msg.payload);
    });
  }
  RED.nodes.registerType('reject', RejectNode);
};
