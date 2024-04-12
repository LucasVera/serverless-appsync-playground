import { util } from '@aws-appsync/utils';

export function request (ctx) {
  return {
    operation: 'Query',
    query: {
      expression: '#pk = :pkValue AND begins_with(#sk, :skValue1)',
      // expression: '#pk = :pkValue AND (begins_with(#sk, :skValue1) OR begins_with(#sk, :skValue2))',
      expressionNames: {
        '#pk': 'BookingSessionId',
        '#sk': 'SK'
      },
      expressionValues: {
        ':pkValue': util.dynamodb.toDynamoDB('ee74e035-4d95-4dc1-ad25-955ae163abc6'),
        ':skValue1': util.dynamodb.toDynamoDB('bound#LAX-YYZ-2023-05-21-ABC123#'),
        // ':skValue2': 'bound#YYZ-LAX-2023-06-06-ABC123#'
      }
    },
    // filter: {
    //   expression: `
    //   (
    //     #recommendationColumn.#id = :recommendationId1Value OR
    //     #recommendationColumn.#id = :recommendationId2Value
    //   ) AND #expirationTimeColumn > :expirationTimeValue`,
    //   expressionNames: {
    //     '#recommendationColumn': 'Recommendation',
    //     '#id': 'id',
    //     '#boundDetailsColumn': 'BoundDetails',
    //     '#expirationTimeColumn': 'ExpirationTime'
    //   },
    //   expressionValues: {
    //     ':recommendationId1Value': util.dynamodb.toDynamoDB('eae96e1a-82fc-461a-baee-98858dd476cf'),
    //     ':recommendationId2Value': util.dynamodb.toDynamoDB('1c92b602-e0db-424b-a4f2-97e664a7a193'),
    //     ':expirationTimeValue': util.dynamodb.toDynamoDB(168236728)
    //   }
    // },
    select: 'ALL_ATTRIBUTES',
  };
}

export function response (ctx) {
  console.log('result', ctx.result);
  return ctx.result;
}


