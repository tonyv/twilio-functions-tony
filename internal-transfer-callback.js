exports.handler = function(context, event, callback) {
  let jwt = require('jsonwebtoken')
  let response = new Twilio.Response()

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
  })
};
