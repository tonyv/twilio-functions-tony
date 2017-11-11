exports.handler = function(context, event, callback) {
  const client = context.getTwilioClient();
  const confSid = event.conference_sid

  client.api.accounts(config.accountSid)
    .conferences(confSid)
    .fetch()
    .then((conference) => {
      console.log(conference)
      if (conference) {
        conference.update({status: "completed"})
        .then((conference) => console.log("closed conf"))
      }
    })
    .catch((error) => {
      console.log(error)
      callback(null, {});
    })
};
