var should = require('should');
var helper = require('node-red-node-test-helper');
var shared = require('../shared.js');
var ttsNode = require('../../../nodes/config/tts.js');
var awsNode = require('../../../nodes/config/aws.js');
var nock = require('nock');
var AWS = require('aws-sdk');
var sinon = require('sinon');
var crypto = require('crypto');
var fs = require('fs');

helper.init(require.resolve('node-red'));

describe('tts config node', function() {
  before(function() {
    nock.disableNetConnect();
  });

  after(function() {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(done);
  });

  var simpleFlow = [{ id: 'n1', type: 'tts', name: 'test name', aws: 'n2', text: 'hello' }, { id: 'n2', type: 'aws' }];
  var extendedFlow = [
    { id: 'n1', type: 'tts', name: 'test name', aws: 'n2', text: 'hello', language: 'en-US', voice: 'Joanna' },
    { id: 'n2', type: 'aws', bucket: 'bucket', region: 'region' },
  ];
  var testNodes = [ttsNode, awsNode];
  var headObject = (AWS.S3.prototype['headObject'] = sinon.stub());
  var headBucket = (AWS.S3.prototype['headBucket'] = sinon.stub());
  var createBucket = (AWS.S3.prototype['createBucket'] = sinon.stub());
  var synthesizeSpeech = (AWS.Polly.prototype['synthesizeSpeech'] = sinon.stub());
  var putObject = (AWS.S3.prototype['putObject'] = sinon.stub());

  var getAWSMethodStub = function(service, method, promise) {
    var methodStub = (AWS[service].prototype[method] = sinon.stub());
    methodStub.returns({
      promise: promise,
    });
    return methodStub;
  };

  var promiseResolve = function() {
    return Promise.resolve({});
  };

  var promiseReject = function() {
    return Promise.reject({});
  };

  var getS3Filename = function(text, language, voice) {
    var textHash = crypto
      .createHash('md5')
      .update(text)
      .digest('hex');
    return `${language}-${voice}-${textHash}.wav`;
  };

  it('should be loaded with proper name', function(done) {
    headObject = getAWSMethodStub('S3', 'headObject', promiseResolve);

    helper.load(testNodes, simpleFlow, function() {
      var n1 = helper.getNode('n1');
      n1.should.have.property('name', 'test name');
      done();
    });
  });

  it('should check if sound file exists', function(done) {
    headObject = getAWSMethodStub('S3', 'headObject', promiseResolve);

    helper.load(testNodes, simpleFlow, function() {
      var n1 = helper.getNode('n1');
      sinon.assert.calledOnce(headObject);
      done();
    });
  });

  it('should set URL to existing sound file', function(done) {
    var headObjectPromise = Promise.resolve({});
    headObject = getAWSMethodStub('S3', 'headObject', function() {
      return headObjectPromise;
    });

    helper.load(testNodes, extendedFlow, function() {
      var n1 = helper.getNode('n1');
      var s3filename = getS3Filename(n1.text, n1.language, n1.voice);

      headObjectPromise.then(function() {
        should(n1.s3url).be.eql(`https://${n1.aws.bucket}.s3.${n1.aws.region}.amazonaws.com/${s3filename}`);
        done();
      });
    });
  });

  it('should check if bucket exists when sound file was not found', function(done) {
    headObject = getAWSMethodStub('S3', 'headObject', promiseReject);
    headBucket = getAWSMethodStub('S3', 'headBucket', promiseResolve);
    synthesizeSpeech = getAWSMethodStub('Polly', 'synthesizeSpeech', function() {
      sinon.assert.calledOnce(headObject);
      sinon.assert.calledOnce(headBucket);
      sinon.assert.callOrder(headObject, headBucket);
      done();
      return Promise.reject({});
    });

    helper.load(testNodes, extendedFlow, function() {
      var n1 = helper.getNode('n1');
    });
  });

  it('should create bucket and sound file if they do not exist', function(done) {
    headObject = getAWSMethodStub('S3', 'headObject', promiseReject);
    headBucket = getAWSMethodStub('S3', 'headBucket', promiseReject);
    createBucket = getAWSMethodStub('S3', 'createBucket', promiseResolve);
    synthesizeSpeech = getAWSMethodStub('Polly', 'synthesizeSpeech', function() {
      var data = {
        ContentType: 'audio/pcm',
        RequestCharacters: 5,
        AudioStream: fs.readFileSync('test/resources/sound/hello.pcm'),
      };
      return Promise.resolve(data);
    });
    putObject = getAWSMethodStub('S3', 'putObject', function() {
      sinon.assert.calledOnce(headObject);
      sinon.assert.calledOnce(headBucket);
      sinon.assert.calledOnce(createBucket);
      sinon.assert.calledOnce(synthesizeSpeech);
      sinon.assert.calledOnce(putObject);
      var data = {
        Bucket: 'bucket',
        Key: 'en-US-Joanna-5d41402abc4b2a76b9719d911017c592.wav',
        Body: fs.readFileSync('test/resources/sound/hello.wav'),
        ACL: 'public-read',
      };
      sinon.assert.calledWithExactly(putObject, data);
      sinon.assert.callOrder(headObject, headBucket, createBucket, synthesizeSpeech, putObject);
      return Promise.resolve({});
    });

    helper.load(testNodes, extendedFlow, function() {
      var n1 = helper.getNode('n1');
      var s3filename = getS3Filename(n1.text, n1.language, n1.voice);

      setTimeout(function() {
        should(n1.s3url).be.eql(`https://${n1.aws.bucket}.s3.${n1.aws.region}.amazonaws.com/${s3filename}`);
        done();
      }, 0);
    });
  });
});
