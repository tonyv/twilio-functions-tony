exports.handler = function(context, event, callback) {
  let jwt = require('jsonwebtoken')
  let response = new Twilio.Response()

  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'POST');
  response.appendHeader('Content-Type', 'application/json');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  const conferenceSid = event.conferenceSid
  const token = event.token
  const client = context.getTwilioClient();

  jwt.verify(token, context.AUTH_TOKEN, function(err, decoded) {
    if(err) {
      response.appendHeader('Status', 401)
      callback(null, response)
    } else {

      const resp = new VoiceResponse();
      const dial = resp.dial();

      dial.conference({
        beep: true,
        startConferenceOnEnter: true,
        endConferenceOnExit: false
      }, conferenceSid);

      callback(null, resp)
  })
};
