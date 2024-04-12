
export function request (ctx) {
  console.log('ctx', ctx);
  console.log({
    fieldName: ctx.info.fieldName,
    headers: ctx.request.headers,
    logTypeCustom: 'aco-custom'
  });
  runtime.earlyReturn({ id: 1 });
  return {};
}

export function response (ctx) {
  const {
    arguments: {
      input
    }
  } = ctx;

  console.log('input', input);
  console.log('parsed', JSON.parse(input.testJson));

  const parsed = JSON.parse(input.testJson);

  return {
    id: "id",
    test1: parsed.test1,
    test2: parsed.test2,
    originalJson: input.testJson,
    doesntexist: 'Whjat'
  };
}
