const conferenceSid = event.conference_id
const client = context.getTwilioClient();

client
  .conferences(conferenceSid)
  .participants.create({to: "+12162083661", from: "2146438999", earlyMedia: "true", record: "true"})
  .then((participant) => {
    console.log(participant.callSid)
    res.send({callSid: participant.callSid});
  })
  .catch((error) => {
    console.log(error)
  })
