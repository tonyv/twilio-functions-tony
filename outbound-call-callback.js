exports.handler = function(context, event, callback) {
  let jwt = require('jsonwebtoken')
  let response = new Twilio.Response()

  const to = event.to
  const from = event.from
  const conferenceSid = event.sid
  const token = event.token
  const client = context.getTwilioClient();

  jwt.verify(token, context.AUTH_TOKEN, function(err, decoded) {
    if(err) {
      response.appendHeader('Status', 401)
      callback(null, response)
    } else {
      client
        .conferences(conferenceSid)
        .participants.create({to: to, from: from, earlyMedia: "true"})
        .then((participant) => {
          const resp = new Twilio.VoiceResponse();
          const dial = resp.dial();
          dial.conference({
            beep: false,
            waitUrl: '',
            startConferenceOnEnter: true,
            endConferenceOnExit: false
          }, conferenceSid);
          callback(null, resp)

          // Now update the task with a conference attribute with Agent Call Sid
          client.taskrouter.v1
            .workspaces(context.TWILIO_WORKSPACE_SID)
            .tasks(conferenceSid)
            .update({
              attributes: JSON.stringify({conference: {sid: participant.conferenceSid, participants: {worker: participant.callSid, customer: ""}}}),
            }).then((task) => {
              console.log(task)
            })
            callback(null, {});
        })
        .catch((error) => {
          console.log(error)
        })
    }
  })
};
