import { util } from '@aws-appsync/utils';

export function request (ctx) {
  const {
    input: {
      subscriptionId,
      pnrStatus,
    }
  } = ctx.args;



  const now = util.time.nowEpochMilliSeconds();
  return {
    operation: 'UpdateItem',
    key: util.dynamodb.toMapValues({
      ShoppingCartId: 'f83019e6-eb2a-48dc-a3bc-83ed7abff346',
      SK: `subscriptionId#${subscriptionId}`
    }),
    update: {
      expression: 'SET #creationTimeColumn = :creationTimeValue, #orderStatusColumn = :orderStatusValue',
      expressionNames: { '#creationTimeColumn': 'CreationTime', '#orderStatusColumn': 'orderCreationStatus' },
      expressionValues: {
        ':creationTimeValue': util.dynamodb.toDynamoDB(now),
        ':orderStatusValue': util.dynamodb.toDynamoDB(pnrStatus),
      },
    },
  };
}

export function response (ctx) {
  const {
    result
  } = ctx;

  console.log('result', result);

  return {
    timestamp: result?.CreationTime ?? -1,
    isOrderCreated: result?.orderCreationStatus === 'completed' ?? false,
    subscriptionId: result?.subscriptionId ?? 'nope',
  };
}
