exports.handler = function(context, event, callback) {
  let jwt = require('jsonwebtoken')
  let response = new Twilio.Response()
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'POST');
  response.appendHeader('Content-Type', 'application/json');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  const client = context.getTwilioClient();
  const confSid = event.conferenceSid
  const token = event.token

  jwt.verify(token, context.AUTH_TOKEN, function(err, decoded) {
    if (err) {
      response.appendHeader(status, '401')
      callback(null, response)
    } else {
      client.api.accounts(context.ACCOUNT_SID)
        .conferences(confSid)
        .fetch()
        .then((conference) => {
          if (conference) {
            conference.update({status: "completed"})
            .then((conference) => {
              response.setBody({result: conference.status})
              callback(null, response)
            })
          }
        })
        .catch((error) => {
          console.log(error)
          callback(null, response);
        })
    }
  })
};
