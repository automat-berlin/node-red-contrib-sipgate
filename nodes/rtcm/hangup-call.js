module.exports = function(RED) {
  'use strict';
  var request = require('request');

  function HangupCallNode(config) {
    RED.nodes.createNode(this, config);
    this.account = RED.nodes.getNode(config.account);
    var node = this;

    node.on('input', function(msg) {
      var credentialString = node.account.getCredentialString();
      var opts = {};
      opts.url = 'https://api.sipgate.com/v2/calls/' + msg.payload.callId;
      opts.method = 'DELETE';
      opts.headers = {};
      opts.headers['Authorization'] = 'Basic ' + credentialString;
      opts.headers['Content-Type'] = 'application/json';
      request(opts, function (error, response) {
        if (response && response.statusCode == 404) {
          node.warn('Call with callId ' + msg.payload.callId + ' not found.');
        }
      });
    });
  }
  RED.nodes.registerType('hangup-call', HangupCallNode);
};
