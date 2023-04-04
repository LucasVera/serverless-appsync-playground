import { util } from '@aws-appsync/utils';
export function request (ctx) {
  // Inspect previous resolver result
  console.log('officeIdFetchResolver.request()', ctx.result, ctx.prev.result);

  if (ctx.prev.result) {
    return ctx.prev.result;
  }

  return {
    version: "2018-05-29",
    operation: "Invoke",
    payload: {
      type: "Query",
      field: "getLucasTest",
      arguments: {
        previousResult: !!ctx.prev.result ? ctx.prev.result : null,
      }
    }
  };
}

export function response (ctx) {
  console.log('officeIdFetchResolver.response()', ctx.result, ctx.prev.result, ctx.stash);

  if (ctx.result) {
    return ctx.result;
  }

  return JSON.stringify([{ name: 'normal return' }]);
}
