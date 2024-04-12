const { inspect } = require('util');

module.exports.handler = async (event, context) => {
  const PurchaseSessionId = '4557dfa3-dbc3-4610-9b4b-326e0f1e7c92';
  const SK = '#details';

  const ShoppingCartId = 'f83019e6-eb2a-48dc-a3bc-83ed7abff346';
  const BookingSessionId = '6e553305-8511-48b2-90fe-028a57519570';

  // 1. Update purchase session status to "In Progress" (conditional update for idempotency)
  // 2. invoke authorize payment lambda
  //    2.1 Read shopping cart and purchase session
  //    2.2 calculate how much to authorize for each fop
  //    2.3 call EIP authorize payment MFOP
  //    2.4 For now only considering frictionless payment:
  //        2.4.1 if authorize payment is successful, update purchase session status
  //              to "Authorize Success", then go to 3
  //        2.4.2 if authorize payment is not successful and retries are not possible (400)
  //              update purchase session status to "Authorize Failure".
  //              Notification status will be sent to FE through mutation
  //        2.4.3 if authorize payment is not successful and retries are possible (500)
  //              retry the eip call (max 3 times - with backoff)
  // 3. invoke ticketing lambda
  //    3.1 call EIP ticketing 
  //    3.2 if ticketing is successful, update purchase session status to "Ticketing Success"
  //        and continue to 4
  //    3.3 if ticketing is not successful and retries are not possible (400)
  //        update purchase session status to "Ticketing Failure".
  //        Notification status will be sent to FE through mutation
  //    3.4 if ticketing is not successful and retries are possible (500)
  //        retry the eip call (max 3 times - with backoff)
  // 4. check for enrollment in loyalty program. if so, add message to sqs
  // 5. check for third party purchases. if so, add message to sqs


  const { payload } = event;
  console.log('event', inspect(event, false, 5));
  if (payload.type === 'authorize-payment') {
    console.log('authorize-payment, assuming success for now');
    return {
      PurchaseSessionId,
      SK,
      ShoppingCartId,
      BookingSessionId,
      PaymentStatus: 'Authorize Success',
    };
  }
  if (payload.type === 'ticketing') {
    console.log('ticketing');
  }
  if (payload.type === 'notification') {
    console.log('notification');
  }

  return true;
};
