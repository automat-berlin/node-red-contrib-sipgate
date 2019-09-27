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
    var pollyConfig = Object.assign({ apiVersion: '2016-06-10' }, awsConfig);
    var s3Config = Object.assign({ apiVersion: '2006-03-01' }, awsConfig);
    var polly = AWS.Polly(pollyConfig);
    var S3 = AWS.S3(s3Config);

    var textHash = crypto
      .createHash('md5')
      .update(node.text)
      .digest('hex');
    node.s3filename = `${node.language}-${node.voice}-${textHash}.wav`;

    function setS3url() {
      node.s3url = `https://${node.aws.bucket}.s3.${node.aws.region}.amazonaws.com/${node.s3filename}`;
    }

    AWS.headObject(node.aws.bucket, node.s3filename)
      .then(function() {
        setS3url();
      })
      .catch(function() {
        AWS.headBucket(node.aws.bucket)
          .catch(function() {
            return AWS.createBucket(node.aws.bucket);
          })
          .then(function() {
            return AWS.synthesizeSpeech(node.text, node.language, node.voice, textHash);
          })
          .then(function(data) {
            var pollyData = data.AudioStream;
            var body = convertPCMToWAV(pollyData);
            return AWS.putObject(node.aws.bucket, node.s3filename, body);
          })
          .then(function() {
            setS3url();
          })
          .catch(function(err) {
            node.error(err, err.stack);
          });
      });
  }
  RED.nodes.registerType('tts', TTSNode);

  var cleanState = function() {
    AWS.cleanState();
    RED.events.removeListener('nodes-stopped', cleanState);
  };
  RED.events.on('nodes-stopped', cleanState);
};
