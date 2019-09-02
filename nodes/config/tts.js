module.exports = function(RED) {
  'use strict';
  var AWS = require('aws-sdk');
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
    var polly = new AWS.Polly(pollyConfig);
    var S3 = new AWS.S3(s3Config);

    var textHash = crypto
      .createHash('md5')
      .update(node.text)
      .digest('hex');
    node.s3filename = `${node.language}-${node.voice}-${textHash}.wav`;

    function textToSpeech() {
      var ttsParams = {
        OutputFormat: 'pcm',
        SampleRate: '8000',
        Text: node.text,
        TextType: 'text',
        LanguageCode: node.language,
        VoiceId: node.voice,
      };
      return polly.synthesizeSpeech(ttsParams).promise();
    }

    function headBucket() {
      var params = {
        Bucket: node.aws.bucket,
      };
      return S3.headBucket(params).promise();
    }

    function createBucket() {
      var params = {
        Bucket: node.aws.bucket,
      };
      return S3.createBucket(params).promise();
    }

    function headObject() {
      var params = {
        Bucket: node.aws.bucket,
        Key: node.s3filename,
      };
      return S3.headObject(params).promise();
    }

    function setS3url() {
      node.s3url = `https://${node.aws.bucket}.s3.${node.aws.region}.amazonaws.com/${node.s3filename}`;
    }

    headObject()
      .then(function() {
        setS3url();
      })
      .catch(function() {
        headBucket()
          .catch(function() {
            return createBucket();
          })
          .then(function() {
            return textToSpeech();
          })
          .then(function(data) {
            var pollyData = data.AudioStream;
            var body = convertPCMToWAV(pollyData);
            var objectParams = { Bucket: node.aws.bucket, Key: node.s3filename, Body: body, ACL: 'public-read' };
            return S3.putObject(objectParams).promise();
          })
          .then(function() {
            setS3url();
          })
          .catch(function(err) {
            console.log(err, err.stack);
          });
      });
  }
  RED.nodes.registerType('tts', TTSNode);
};
