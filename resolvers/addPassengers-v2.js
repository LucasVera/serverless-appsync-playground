
export function request (ctx) {
  return {
    operation: 'Invoke',
    payload: {
      arguments: {}
    }
  };
}

export function response (ctx) {
  console.log('addPassengers-v2.response()', ctx.result, ctx.prev.result, ctx.stash);
}
