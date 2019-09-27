module.exports = function(RED) {
  'use strict';
  var AWS = require('../../utils/awsService.js');
  var crypto = require('crypto');
  var convertPCMToWAV = require('../../utils/convertPCMToWAV.js');

  function TTSNode(config) {
    RED.nodes.createNode(this, config);
    this.aws = RED.nodes.getNode(config.aws);
    this.text = config.text;
    this.language = config.language;
    this.voice = config.voice;
    var node = this;

    var awsConfig = {
      accessKeyId: node.aws.credentials.accessKeyId,
      secretAccessKey: node.aws.credentials.secretAccessKey,
      region: node.aws.region,
    };
    var client = AWS.client(awsConfig);

    var textHash = crypto
      .createHash('md5')
      .update(node.text)
      .digest('hex');
    node.s3filename = `${node.language}-${node.voice}-${textHash}.wav`;

    function setS3url() {
      node.s3url = `https://${node.aws.bucket}.s3.${node.aws.region}.amazonaws.com/${node.s3filename}`;
    }

    client
      .headObject(node.aws.bucket, node.s3filename)
      .then(function() {
        setS3url();
      })
      .catch(function() {
        client
          .headBucket(node.aws.bucket)
          .catch(function() {
            return client.createBucket(node.aws.bucket);
          })
          .then(function() {
            return client.synthesizeSpeech(node.text, node.language, node.voice, textHash);
          })
          .then(function(data) {
            var pollyData = data.AudioStream;
            var body = convertPCMToWAV(pollyData);
            return client.putObject(node.aws.bucket, node.s3filename, body);
          })
          .then(function() {
            setS3url();
          })
          .catch(function(err) {
            node.error(err, err.stack);
          });
      });

    var cleanState = function() {
      client.cleanState();
    };
    RED.events.once('nodes-stopped', cleanState);
  }
  RED.nodes.registerType('tts', TTSNode);
};
