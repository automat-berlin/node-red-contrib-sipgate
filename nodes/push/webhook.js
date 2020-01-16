module.exports = function(RED) {
  'use strict';
  var bodyParser = require('body-parser');

  function WebhookNode(config) {
    RED.nodes.createNode(this, config);
    if (!config.url) {
      this.warn('missing path');
      return;
    }
    this.url = config.url;
    if (this.url[0] !== '/') {
      this.url = '/' + this.url;
    }
    this.method = 'post';

    var node = this;

    this.errorHandler = function(err, req, res) {
      node.warn(err);
      res.sendStatus(500);
    };

    this.callback = function(req, res) {
      var msgid = RED.util.generateId();
      res._msgid = msgid;
      node.send({ _msgid: msgid, req: req, res: { _res: res }, payload: req.body });
    };

    var maxApiRequestSize = RED.settings.apiMaxLength || '5mb';
    var urlencParser = bodyParser.urlencoded({ limit: maxApiRequestSize, extended: true });

    RED.httpAdmin.post(this.url, urlencParser, this.callback, this.errorHandler);

    this.on('close', function() {
      var node = this;
      RED.httpAdmin._router.stack.forEach(function(route, i, routes) {
        if (route.route && route.route.path === node.url && route.route.methods[node.method]) {
          routes.splice(i, 1);
        }
      });
    });
  }
  RED.nodes.registerType('webhook', WebhookNode);
};
