exports.handler = function(context, event, callback) {
  console.log(event)
  const toPhone = event.ToPhone
  const fromPhone = event.FromPhone
  const conferenceSid = event.Sid
  const client = context.getTwilioClient();

  client
    .conferences(conferenceSid)
    .participants.create({to: toPhone, from: fromPhone, earlyMedia: "true"})
    .then((participant) => {

      const resp = new Twilio.twiml.VoiceResponse();
      const dial = resp.dial();

      dial.conference({
        beep: false,
        waitUrl: '',
        startConferenceOnEnter: true,
        endConferenceOnExit: false
      }, conferenceSid);

      // Now update the task with a conference attribute with Agent Call Sid
      // MOVE THIS TO ANOTHER FUNCTION
      // client.taskrouter.v1
      //   .workspaces(context.TWILIO_WORKSPACE_SID)
      //   .tasks(conferenceSid)
      //   .update({
      //     attributes: JSON.stringify({conference: {sid: participant.conferenceSid, participants: {worker: participant.callSid, customer: ""}}}),
      //   }).then((task) => {
      //     console.log(task)
      //   })
      //
      callback(null, resp)
    })
};
