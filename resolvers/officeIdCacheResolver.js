import { util } from '@aws-appsync/utils';
export function request (ctx) {
  // (TODO): Fetch the officeId from the dynamodb cache table with appropriate key from args
  console.log('officeIdCacheResolver.request()');
  const {
    id
  } = ctx.args;

  return { operation: 'GetItem', key: util.dynamodb.toMapValues({ id: id || '123' }) };
}

export function response (ctx) {
  // Pass result to the next resolver in pipeline
  const { error, result } = ctx;
  console.log('officeIdCacheResolver.response()', result);
  if (error) {
    console.log('Error in officeIdCacheResolver.response(): ', error);
    return util.appendError(error.message, error.type, result);
  }

  return result;
}
