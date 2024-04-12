const { inspect } = require('util');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({ region: 'us-east-1' });



const streamToString = (stream) => {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
};


const isJson = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

const processS3Object = async (bucketName, key) => {
  const params = {
    Bucket: bucketName,
    Key: key
  };

  const command = new GetObjectCommand(params);
  const response = await s3Client.send(command);
  const body = await streamToString(response.Body);

  // Validate if it's json
  if (!isJson(body)) {
    console.log('not json', body, bucketName, key);
    throw new Error('Invalid JSON file');
  }

  return true;
};

module.exports.handler = async (event) => {
  try {
    const { Records } = event;

    const promises = Records?.map(record => {
      const { s3 } = record;
      return processS3Object(s3.bucket.name, s3.object.key);
    });

    await Promise.all(promises);
    return true;
  }
  catch (ex) {
    console.error('Exception: ', ex);
  }
};

