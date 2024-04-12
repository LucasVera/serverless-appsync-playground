

module.exports.handler = async (event, context) => {
  console.log('event: ', event);
  console.log('context: ', context);

  const shouldGetFromEventBridge = true;

  if (shouldGetFromEventBridge) {
    console.log('should get from event bridge is true');
  }

  return 'yes';
};
