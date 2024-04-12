export function request (ctx) {
  console.log('flightSearchResolver.request()', ctx);
  console.log('identity', ctx.identity);
  const {
    prev: { result: officeIdResult },
    identity
  } = ctx;

  if (!identity || !identity.sub) {
    // Auth method is not user pool, no need to call auth lambda
    console.log('early return');
    runtime.earlyReturn();
  }

  return {
    version: "2018-05-29",
    operation: "Invoke",
    payload: {
      type: "Query",
      field: "getLucasTest",
      arguments: {
        officeIdResult,
      }
    }
  };
}

export function response (ctx) {
  const { error, result } = ctx;
  if (error) {
    console.log('Error in flightSearchResolver.response(): ', error);
    return util.appendError(error.message, error.type, result);
  }
  if (!result.authorized) {
    return util.unauthorized();
  }
  return ctx.result;
}
