exports.handler = function(context, event, callback) {
  let jwt = require('jsonwebtoken')
  let response = new Twilio.Response()
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'POST');
  response.appendHeader('Content-Type', 'application/json');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  const ClientCapability = Twilio.jwt.ClientCapability;
  const clientName = event.clientName;
  const token = event.token;
  console.log(token);
  console.log(clientName);
  jwt.verify(token, context.AUTH_TOKEN, function(err, decoded) {
    if (err) {
      response.appendHeader('status', '401')
      callback(null, response)
    } else {
      const capability = new ClientCapability({
          accountSid: context.ACCOUNT_SID,
          authToken: context.AUTH_TOKEN,
      });
      capability.addScope(new ClientCapability.IncomingClientScope(clientName));
      capability.addScope(
        new ClientCapability.OutgoingClientScope({applicationSid: context.TWILIO_TWIML_APP})
      );
      response.setBody({token: capability.toJwt()});
      callback(null, response);
    }
  })
}
