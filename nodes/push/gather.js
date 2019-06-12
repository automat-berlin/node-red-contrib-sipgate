module.exports = function(RED) {
  "use strict";
  var xmlbuilder = require('xmlbuilder');
  var url = require('url');
  var bodyParser = require('body-parser');

  function GatherNode(config) {
    RED.nodes.createNode(this, config);
    this.maxDigits = config.maxDigits || 1;
    this.timeout = config.timeout || 2000;
    this.playUrl = config.playUrl;
    this.onHangup = config.onHangup;
    this.onData = '/dtmf-' + randomId();
    var node = this;

    node.on('input', function(msg) {
      var onDataAbsoluteUrl = url.resolve(this.context().global.get('baseUrl'), node.onData);
      var root = xmlbuilder.create('Response').dec('1.0', 'UTF-8');
      var xml = root.ele('Gather', { 'onData': onDataAbsoluteUrl, 'maxDigits': node.maxDigits, 'timeout': node.timeout });
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

    function randomId() {
      return Math.floor(Math.random() * 1000000);
    }

    this.url = node.onData;
    this.method = 'post';

    this.errorHandler = function(err, req, res, next) {
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

    RED.httpNode.post(this.url, urlencParser, this.callback, this.errorHandler);

    this.on('close', function() {
      var node = this;
      RED.httpNode._router.stack.forEach(function(route, i, routes) {
        if (route.route && route.route.path === node.url && route.route.methods[node.method]) {
          routes.splice(i, 1);
        }
      });
    });
  }
  RED.nodes.registerType("gather", GatherNode);
}
