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
    this.onAnswer = config.onAnswer;
    this.onHangup = config.onHangup;
    this.outputs = config.outputs;
    this.callbackUrl = '/callback-' + randomId();
    this.method = 'post';
    var node = this;

    node.on('input', function(msg) {
      var absoluteCallbackUrl = url.resolve(this.context().global.get('baseUrl'), node.callbackUrl);
      var root = xmlbuilder.create('Response').dec('1.0', 'UTF-8');
      var xml = root.ele('Gather', { 'onData': absoluteCallbackUrl, 'maxDigits': node.maxDigits, 'timeout': node.timeout });
      if (node.playUrl) {
        xml.ele('Play').ele('Url', {}, node.playUrl);
      }
      if (node.onAnswer) {
        root.att('onAnswer', absoluteCallbackUrl);
      }
      if (node.onHangup) {
        root.att('onHangup', absoluteCallbackUrl);
      }
      msg.payload = xml.end({ pretty: true, indent: '    ' });
      msg.res._res.set('Content-Type', 'application/xml');
      msg.res._res.status(200).send(msg.payload);
    });

    function randomId() {
      return Math.floor(Math.random() * 1000000);
    }

    this.errorHandler = function(err, req, res, next) {
      node.warn(err);
      res.sendStatus(500);
    };

    this.callback = function(req, res) {
      var msgid = RED.util.generateId();
      res._msgid = msgid;
      var msg = { _msgid: msgid, req: req, res: { _res: res }, payload: req.body };
      var envelope = [];
      (req.body.event == 'dtmf') ? envelope.push(msg) : envelope.push(null);
      (req.body.event == 'answer' && node.onAnswer) ? envelope.push(msg) : envelope.push(null);
      (req.body.event == 'hangup' && node.onHangup) ? envelope.push(msg) : envelope.push(null);
      if (req.body.event != 'dtmf') {
        res.sendStatus(200);
      }
      node.send(envelope);
    };

    var maxApiRequestSize = RED.settings.apiMaxLength || '5mb';
    var urlencParser = bodyParser.urlencoded({ limit: maxApiRequestSize, extended: true });

    RED.httpNode.post(this.callbackUrl, urlencParser, this.callback, this.errorHandler);

    this.on('close', function() {
      var node = this;
      RED.httpNode._router.stack.forEach(function(route, i, routes) {
        if (route.route && route.route.path === node.callbackUrl && route.route.methods[node.method]) {
          routes.splice(i, 1);
        }
      });
    });
  }
  RED.nodes.registerType("gather", GatherNode);
}
