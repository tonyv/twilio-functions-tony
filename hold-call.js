exports.handler = function(context, event, callback) {
  let jwt = require('jsonwebtoken')

  const client = context.getTwilioClient();
  const confSid = event.conference_sid
  const callSid = event.call_sid
  const toggle = event.toggle
  const token = event.token

  jwt.verify(token, context.AUTH_TOKEN, function(err, decoded) {
    if (err) {
      response.appendHeader('Status', 401)
      callback(null, response)
    } else {
      client.api.accounts(context.accountSid)
        .conferences(confSid)
        .participants(callSid)
        .update({hold: toggle})
        .then((participant) => console.log(participant.hold))
        .done();

      callback(null, twiml);
    }
  })
};
