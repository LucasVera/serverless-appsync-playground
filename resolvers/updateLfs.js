import { util } from '@aws-appsync/utils';

export function request (ctx) {
  return {
    operation: 'Invoke',
    payload: {}
  };
}

export function response (ctx) {
  console.log('result', ctx.result);
  return ctx.result;
}
