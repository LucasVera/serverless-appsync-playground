export function request (ctx) {
  // Inspect previous resolver result
  console.log('officeIdFetchResolver.request()', ctx.result, ctx.prev.result);

  const {
    officeIdResult,
    input
  } = ctx.prev.result;

  if (officeIdResult && officeIdResult.id) {
    runtime.earlyReturn(officeIdResult);
  }

  return {
    version: "2018-05-29",
    operation: "Invoke",
    payload: {
      type: "Query",
      field: "getLucasTest",
      arguments: {
        id: input.id,
      }
    }
  };
}

export function response (ctx) {
  console.log('officeIdFetchResolver.response()', ctx.result, ctx.prev.result, ctx.stash);
  return ctx.result;
}
