exports.handler = function(context, event, callback) {
  console.log(event)
  let jwt = require('jsonwebtoken')

  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', '*');
  response.appendHeader('Content-Type', '*');
  response.appendHeader('Access-Control-Allow-Headers', '*');

  const callSid = event.call_sid
  const conferenceSid = event.conferenceSid
  const client = context.getTwilioClient();

    client.calls(callSid)
      .update({method: 'POST', url: 'https://absurd-pizzas-9864.twil.io/conference?conferenceSid=' + conferenceSid})
      .then((call) => {
        callback(null, response)
      })
      .done();

    callback(null, response)
}
