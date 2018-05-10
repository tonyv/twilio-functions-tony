exports.handler = function(context, event, callback) {
    let response = new Twilio.Response()
    console.log("help");

  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
  //response.appendHeader('Content-Type', 'application/json');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  const from = event.from
  const to = event.to
  const conference = event.taskSid
  const client = context.getTwilioClient()

  client
    .conferences(conference)
    .participants.create({to: to, from: from, earlyMedia: "true"})
    .then((participant) => {
        response.setBody({participant:participant});
      callback(null, response)
    });
};
