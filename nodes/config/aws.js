module.exports = function(RED) {
  'use strict';

  function AWSNode(config) {
    RED.nodes.createNode(this, config);
    this.region = config.region;
    this.bucket = config.bucket;
  }
  RED.nodes.registerType('aws', AWSNode, {
    credentials: {
      accessKeyId: { type: 'text' },
      secretAccessKey: { type: 'password' },
    },
  });
};
