import { util } from '@aws-appsync/utils';

export function request (ctx) {
  return {
    operation: 'GetItem',
    key: util.dynamodb.toMapValues({
      ShoppingCartId: 'f83019e6-eb2a-48dc-a3bc-83ed7abff346',
      SK: 'ac_fare_rules'
    }),
  };
}

export function response (ctx) {
  console.log('result', ctx.result);
  return ctx.result;
}

