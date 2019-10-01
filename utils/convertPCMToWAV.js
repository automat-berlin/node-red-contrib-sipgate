module.exports = function(data) {
  var headerLength = 44;
  var header = Buffer.alloc(headerLength);
  var offset = 0;

  var chunkId = Buffer.from('RIFF');
  chunkId.copy(header, offset);
  offset += chunkId.length;

  var chunkSize = data.length + headerLength;
  header.writeUInt32LE(chunkSize - 8, offset);
  offset += 4;

  var format = Buffer.from('WAVE');
  format.copy(header, offset);
  offset += format.length;

  var subchunk1Id = Buffer.from('fmt ');
  subchunk1Id.copy(header, offset);
  offset += subchunk1Id.length;

  var subchunk1IdSize = 16;
  header.writeUInt32LE(subchunk1IdSize, offset);
  offset += 4;

  var audioFormat = 1;
  header.writeUInt16LE(audioFormat, offset);
  offset += 2;

  var numChannels = 1;
  header.writeUInt16LE(numChannels, offset);
  offset += 2;

  var sampleRate = 8000;
  header.writeUInt32LE(sampleRate, offset);
  offset += 4;

  var bitsPerSample = 16;
  var byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  header.writeUInt32LE(byteRate, offset);
  offset += 4;

  var blockAlign = (numChannels * bitsPerSample) / 8;
  header.writeUInt16LE(blockAlign, offset);
  offset += 2;

  header.writeUInt16LE(bitsPerSample, offset);
  offset += 2;

  var subchunk2Id = Buffer.from('data');
  subchunk2Id.copy(header, offset);
  offset += subchunk2Id.length;

  var subchunk2IdSize = data.length;
  header.writeUInt32LE(subchunk2IdSize, offset);

  return Buffer.concat([header, data], headerLength + data.length);
};
