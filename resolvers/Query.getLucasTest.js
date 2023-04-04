export function request (ctx) {
  return {};
}

export function response (ctx) {
  return [
    { name: ctx.prev.result },
  ];
}
