import { util } from '@aws-appsync/utils';
export function request (ctx) {
  // (TODO): Fetch the officeId from the dynamodb cache table with appropriate key from args
  console.log('officeIdCacheResolver.request()', ctx.args);

  const { args: { input: { itineraries } } } = ctx;

  console.log('itineraries: ', itineraries);
  console.log('itineraries without destructuring: ', ctx.args.input.itineraries);

  const [{ id: inputId }] = itineraries;

  ctx.stash.id = inputId;

  return { operation: 'GetItem', key: util.dynamodb.toMapValues({ id: inputId || '' }) };
}

export function response (ctx) {
  // Pass result to the next resolver in pipeline
  const { error, result } = ctx;
  console.log('officeIdCacheResolver.response()', result);
  if (!result || !result) {
    return { officeIdResult: null, input: { id: ctx.stash.id } };
  }

  const num1 = result.num1;
  const num2 = result.map1.num2;

  console.log('num1: ', num1, typeof num1);
  console.log('num2: ', num2, typeof num2);
  console.log('this is true', !!(num1 === num2));
  console.log('this is false', !!(num1 !== num2));


  if (error) {
    console.log('Error in officeIdCacheResolver.response(): ', error);
    return util.appendError(error.message, error.type, result);
  }

  return { officeIdResult: result, input: { id: ctx.stash.id } };
}
