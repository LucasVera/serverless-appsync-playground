import { util } from '@aws-appsync/utils';

export function request (ctx) {
  return {
    operation: 'UpdateItem',
    key: util.dynamodb.toMapValues({
      ShoppingCartId: 'f83019e6-eb2a-48dc-a3bc-83ed7abff346',
      SK: 'session#6e553305-8511-48b2-90fe-028a57519573'
    }),
    update: {
      expression: 'SET #passengers = :passengers, #contactInfo = :contactInfo',
      expressionNames: { '#passengers': 'Passengers', '#contactInfo': 'ContactInfo' },
      expressionValues: {
        ':passengers': util.dynamodb.toDynamoDB({ passenger1: { id: 123123, name: 'pepito', otherfield: 'fdas' } }),
        ':contactInfo': util.dynamodb.toDynamoDB({ email: 'test@test.com' }),
      },
      returnValues: 'ALL_NEW'
    },
    // condition: {
    //   expression: '#expirationTimeColumn > :expirationTimeValue',
    //   expressionNames: { '#expirationTimeColumn': 'ExpirationTime' },
    //   expressionValues: { ':expirationTimeValue': util.dynamodb.toDynamoDB(16993688) }
    // },
  };
}

export function response (ctx) {
  console.log('result', ctx.result);
  return ctx.result;
}

