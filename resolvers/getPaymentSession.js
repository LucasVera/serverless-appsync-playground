
export function request (ctx) {
  return {
    operation: 'Invoke',
    payload: {
      arguments: {}
    }
  };
}

export function response (ctx) {
  console.log('result', ctx.result);
}
