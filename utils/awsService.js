var AWS = require('aws-sdk');

function ClientFactory(config) {
  var client = {
    s3: null,
    polly: null,
    promises: {},
    init: function(config) {
      var pollyConfig = Object.assign({ apiVersion: '2016-06-10' }, config);
      var s3Config = Object.assign({ apiVersion: '2006-03-01' }, config);
      this.polly = new AWS.Polly(pollyConfig);
      this.s3 = new AWS.S3(s3Config);
      this.cleanState();
    },
    cleanState: function() {
      this.promises = {
        createBucket: {},
        headBucket: {},
        synthesizeSpeech: {},
        putObject: {},
        headObject: {},
      };
    },
    createBucket: function(bucket) {
      var params = {
        Bucket: bucket,
      };
      this.promises.createBucket[bucket] = this.promises.createBucket[bucket] || this.s3.createBucket(params).promise();
      return this.promises.createBucket[bucket];
    },
    headBucket: function(bucket) {
      var params = {
        Bucket: bucket,
      };
      this.promises.headBucket[bucket] = this.promises.headBucket[bucket] || this.s3.headBucket(params).promise();
      return this.promises.headBucket[bucket];
    },
    synthesizeSpeech: function(text, language, voice, textHash) {
      var params = {
        OutputFormat: 'pcm',
        SampleRate: '8000',
        Text: text,
        TextType: 'text',
        LanguageCode: language,
        VoiceId: voice,
      };
      var key = `${language}-${voice}-${textHash}`;
      this.promises.synthesizeSpeech[key] =
        this.promises.synthesizeSpeech[key] || this.polly.synthesizeSpeech(params).promise();
      return this.promises.synthesizeSpeech[key];
    },
    putObject: function(bucket, key, body) {
      var params = {
        Bucket: bucket,
        Key: key,
        Body: body,
        ACL: 'public-read',
      };
      var key = `${bucket}-${key}`;
      this.promises.putObject[key] = this.promises.putObject[key] || this.s3.putObject(params).promise();
      return this.promises.putObject[key];
    },
    headObject: function(bucket, key) {
      var params = {
        Bucket: bucket,
        Key: key,
      };
      var key = `${bucket}-${key}`;
      this.promises.headObject[key] = this.promises.headObject[key] || this.s3.headObject(params).promise();
      return this.promises.headObject[key];
    },
  };
  client.init(config);
  return client;
}

module.exports = {
  clients: {},
  client: function(config) {
    var key = `${config.accessKeyId}-${config.region}`;
    this.clients[key] = this.clients[key] || ClientFactory(config);
    return this.clients[key];
  },
};
