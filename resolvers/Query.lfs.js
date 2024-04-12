import { util } from '@aws-appsync/utils';

export function request (ctx) {
  return {
    operation: 'Query',
    query: {
      expression: '#pk = :pkValue AND begins_with(#sk, :skValue)',
      expressionNames: {
        '#pk': 'BookingSessionId',
        '#sk': 'SK'
      },
      expressionValues: {
        ':pkValue': util.dynamodb.toDynamoDB('ee74e035-4d95-4dc1-ad25-955ae163abc6'),
        ':skValue': util.dynamodb.toDynamoDB('bound#LAX-YYZ-2023-05-21-ABC123#'),
      }
    },
    filter: {
      expression: '#expirationTimeColumn > :expirationTimeValue',
      expressionNames: { '#expirationTimeColumn': 'ExpirationTime' },
      expressionValues: { ':expirationTimeValue': util.dynamodb.toDynamoDB(1685101431) }
    },
    select: 'ALL_ATTRIBUTES',
  };
}

export function response (ctx) {
  console.log('result', ctx.result);
  return ctx.result;
}


