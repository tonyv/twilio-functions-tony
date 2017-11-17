exports.handler = function(context, event, callback) {
  let jwt = require('jsonwebtoken')

  const conferenceSid = event.conference_id
  const client = context.getTwilioClient();
  const token = event.token

  jwt.verify(token, context.AUTH_TOKEN, function(err, decoded) {
    if (err) {
      response.appendHeader('Status', 401)
      callback(null, response)
    } else {
      client
        .conferences(conferenceSid)
        .participants.create({to: "+12162083661", from: "2146438999", earlyMedia: "true", record: "true"})
        .then((participant) => {
          console.log(participant.callSid)
          callback(null, {callSid: participant.callSid});
        })
        .catch((error) => {
          console.log(error)
        })
    }
  })
};
