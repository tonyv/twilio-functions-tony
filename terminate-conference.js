exports.handler = function(context, event, callback) {
  let jwt = require('jsonwebtoken')

  const client = context.getTwilioClient();
  const confSid = event.conference_sid
  const token = event.token

  jwt.verify(token, context.AUTH_TOKEN, function(err, decoded) {
    if (err) {
      response.appendHeader(status, '401')
      callback(null, response)
    } else {
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
    }
  })
};
