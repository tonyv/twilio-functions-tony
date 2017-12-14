exports.handler = function(context, event, callback) {
  let jwt = require('jsonwebtoken')
  let response = new Twilio.Response()

  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'POST');
  response.appendHeader('Content-Type', 'application/json');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

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
          const voice_response = new Twilio.VoiceResponse();

          const dial = voice_response.dial();
          dial.conference({
            beep: false,
            waitUrl: '',
            startConferenceOnEnter: true,
            endConferenceOnExit: false
          }, conferenceSid);

          // Now update the task with a conference attribute with Agent Call Sid
          client.taskrouter.v1
            .workspaces(context.TWILIO_WORKSPACE_SID)
            .tasks(conferenceSid)
            .update({
              attributes: JSON.stringify({conference: {sid: participant.conferenceSid, participants: {worker: participant.callSid, customer: ""}}}),
            }).then((task) => {
              console.log(task)
            })

          callback(null, voice_response)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  })
};
