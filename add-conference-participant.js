exports.handler = function(context, event, callback) {
  console.log(event)
  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', '*');
  response.appendHeader('Content-Type', '*');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  const confName = event.conferenceSid
  const client = context.getTwilioClient();

  const resp = new Twilio.twiml.VoiceResponse();
  const dial = resp.dial();

  dial.conference({
    beep: true,
    startConferenceOnEnter: true,
    endConferenceOnExit: false
  }, confName);

  callback(null, resp)
}
