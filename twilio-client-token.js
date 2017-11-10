exports.handler = function(context, event, callback) {
  const ClientCapability = Twilio.jwt.ClientCapability;

  const clientName = 'tvu';

  const capability = new ClientCapability({
      accountSid: context.ACCOUNT_SID,
      authToken: context.AUTH_TOKEN,
  });
  capability.addScope(new ClientCapability.IncomingClientScope(clientName));
  capability.addScope(
    new ClientCapability.OutgoingClientScope({applicationSid: context.TWILIO_TWIML_APP})
  );

  callback(null, capability.toJwt());
}
