exports.handler = function(context, event, callback) {
  const to = event.to
  const from = event.from
  const conferenceSid = event.conference_id
  const client = context.getTwilioClient();

  client
    .conferences(conferenceSid)
    .participants.create({to: to, from: from, earlyMedia: "true", statusCallback: "https://" + context.DOMAIN_NAME + "/api/taskrouter/event"})
    .then((participant) => {
      const resp = new Twilio.VoiceResponse();
      const dial = resp.dial();
      dial.conference({
        beep: false,
        waitUrl: '',
        startConferenceOnEnter: true,
        endConferenceOnExit: false
      }, conferenceSid);
      callback(null, resp.toString())

      // Now update the task with a conference attribute with Agent Call Sid
      client.taskrouter.v1
        .workspaces(context.TWILIO_WORKSPACE_SID)
        .tasks(conferenceSid)
        .update({
          attributes: JSON.stringify({conference: {sid: participant.conferenceSid, participants: {worker: participant.callSid, customer: ""}}}),
        }).then((task) => {
          console.log(task)
        })
        res.send({});
    })
    .catch((error) => {
      console.log(error)
    })

};
