module.exports.handler = async (event) => {
  const arn = event.SecretId;
  const token = event.ClientRequestToken;
  const step = event.Step;

  console.log(`arn: ${arn}`);
  console.log(`token: ${token}`);
  console.log(`step: ${step}`);
  return true;
};


/*
function transalted from python template to js for automatic rotation:

const AWS = require('aws-sdk');
const secretsmanager = new AWS.SecretsManager();

exports.handler = async (event) => {
    const arn = event.SecretId;
    const token = event.ClientRequestToken;
    const step = event.Step;

    const metadata = await secretsmanager.describeSecret({ SecretId: arn }).promise();
    if (!metadata.RotationEnabled) {
        console.error(`Secret ${arn} is not enabled for rotation`);
        throw new Error(`Secret ${arn} is not enabled for rotation`);
    }

    const versions = metadata.VersionIdsToStages;
    if (!versions[token]) {
        console.error(`Secret version ${token} has no stage for rotation of secret ${arn}.`);
        throw new Error(`Secret version ${token} has no stage for rotation of secret ${arn}.`);
    }

    if (versions[token].includes('AWSCURRENT')) {
        console.info(`Secret version ${token} already set as AWSCURRENT for secret ${arn}.`);
        return;
    } else if (!versions[token].includes('AWSPENDING')) {
        console.error(`Secret version ${token} not set as AWSPENDING for rotation of secret ${arn}.`);
        throw new Error(`Secret version ${token} not set as AWSPENDING for rotation of secret ${arn}.`);
    }

    switch (step) {
        case 'createSecret':
            await createSecret(arn, token);
            break;
        case 'setSecret':
            await setSecret(arn, token);
            break;
        case 'testSecret':
            await testSecret(arn, token);
            break;
        case 'finishSecret':
            await finishSecret(arn, token);
            break;
        default:
            throw new Error('Invalid step parameter');
    }
};

async function createSecret(arn, token) {
    try {
        await secretsmanager.getSecretValue({ SecretId: arn, VersionStage: 'AWSPENDING', VersionId: token }).promise();
        console.info(`createSecret: Successfully retrieved secret for ${arn}.`);
    } catch (error) {
        if (error.code === 'ResourceNotFoundException') {
            const excludeCharacters = process.env.EXCLUDE_CHARACTERS || '/@"\'\\';
            const passwordData = await secretsmanager.getRandomPassword({ ExcludeCharacters: excludeCharacters }).promise();
            await secretsmanager.putSecretValue({
                SecretId: arn,
                ClientRequestToken: token,
                SecretString: passwordData.RandomPassword,
                VersionStages: ['AWSPENDING']
            }).promise();
            console.info(`createSecret: Successfully put secret for ARN ${arn} and version ${token}.`);
        } else {
            throw error;
        }
    }
}

async function setSecret(arn, token) {
    // This is where the secret should be set in the service
    throw new Error('setSecret not implemented');
}

async function testSecret(arn, token) {
    // This is where the secret should be tested against the service
    throw new Error('testSecret not implemented');
}

async function finishSecret(arn, token) {
    const metadata = await secretsmanager.describeSecret({ SecretId: arn }).promise();
    let currentVersion = null;
    for (const version in metadata.VersionIdsToStages) {
        if (metadata.VersionIdsToStages[version].includes('AWSCURRENT')) {
            if (version === token) {
                console.info(`finishSecret: Version ${version} already marked as AWSCURRENT for ${arn}`);
                return;
            }
            currentVersion = version;
            break;
        }
    }

    await secretsmanager.updateSecretVersionStage({
        SecretId: arn,
        VersionStage: 'AWSCURRENT',
        MoveToVersionId: token,
        RemoveFromVersionId: currentVersion
    }).promise();

    console.info(`finishSecret: Successfully set AWSCURRENT stage to version ${token} for secret ${arn}.`);
}


*/

