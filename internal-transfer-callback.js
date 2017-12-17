exports.handler = function(context, event, callback) {

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
