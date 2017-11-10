exports.handler = function(context, event, callback) {
  const client = context.getTwilioClient();
  const confSid = event.conference_sid
  const callSid = event.call_sid
  const toggle = event.toggle

  client.api.accounts(context.accountSid)
    .conferences(confSid)
    .participants(callSid)
    .update({hold: toggle})
    .then((participant) => console.log(participant.hold))
    .done();

  callback(null, twiml);
};
