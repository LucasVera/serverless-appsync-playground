const { DynamoDBClient, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const { inspect } = require('util');
const { marshall } = require('@aws-sdk/util-dynamodb');

module.exports.handler = async (event, context) => {
  const client = new DynamoDBClient({ region: process.env.AWS_REGION });
  const params = {
    TableName: 'lfsCachePoc',
    Key: {
      BookingSessionId: { S: 'ee74e035-4d95-4dc1-ad25-955ae163abc6' },
      SK: { S: 'bound#YYZ-LAX-2023-06-06-ABC123#recommendation#001#1c92b602-e0db-424b-a4f2-97e664a7a193' },
    },
    UpdateExpression: 'SET #Recommendation.#fareDetails.#cabin = :cabin',
    ExpressionAttributeNames: {
      '#Recommendation': 'Recommendation',
      '#fareDetails': 'fareDetails',
      '#cabin': 'cabin',
    },
    ExpressionAttributeValues: marshall({
      ':cabin': [
        {
          eUpgradeStatus: 'Available',
          cabinCode: 'Y',
          offers: [{
            availabilityDetails: {
              eUpgradeInfo: {
                status: 'Available',
                isInClearanceWindows: true,
                credits: 3
              }
            }
          }]
        }
      ],
    }),
  };

  const command = new UpdateItemCommand(params);
  const response = await client.send(command);

  console.log(inspect(response, false, 6));

  return 'ok';
};


