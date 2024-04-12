export function request (ctx) {
  return {
    version: "2018-05-29",
    operation: "Invoke",
    payload: {
      type: "Query",
      field: "getLucasTest",
      arguments: {
        id: 1,
      }
    }
  };
}

export function response (ctx) {
  return ctx.result;
}
