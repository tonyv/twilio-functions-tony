exports.handler = function(context, event, callback) {
  let jwt = require('jsonwebtoken')

  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'POST');
  response.appendHeader('Content-Type', 'application/json');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  const client = context.getTwilioClient();
  const confSid = event.conference_sid
  const callSid = event.call_sid
  const toggle = event.toggle
  const token = event.token

  jwt.verify(token, context.AUTH_TOKEN, function(err, decoded) {
    if (err) {
      response.appendHeader('Status', 401)
      callback(null, response)
    } else {
      client.api.accounts(context.ACCOUNT_SID)
        .conferences(confSid)
        .participants(callSid)
        .update({hold: toggle})
      	.then((participant) => {
        	response.setBody({result: participant.hold})
            callback(null, response)
         })
        .catch((error) => {
          response.setBody({result: "error", message: error.message})
          callback(null, response);
        })
    }
  })
};
