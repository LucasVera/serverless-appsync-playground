const { inspect } = require('util');
module.exports.handler = async (event, context) => {
  console.log('event: ', inspect(event, false, 8));
  console.log('context: ', inspect(context, false, 8));
  if (event.previousResult) {
    return [{ name: event.previousResult }];
  }
  return [{ name: 'normal return' }];
};
