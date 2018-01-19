exports.handler = function(context, event, callback) {
  const ACCOUNT_SID = context.ACCOUNT_SID;

  const SERVICE_SID = context.SYNC_SERVICE_SID;
  const API_KEY = context.TWILIO_API_KEY;
  const API_SECRET = context.TWILIO_API_SECRET;

  // REMINDER: This identity is only for prototyping purposes
  const IDENTITY = 'only for testing';

  const AccessToken = Twilio.jwt.AccessToken;
  const SyncGrant = AccessToken.SyncGrant;

  const syncGrant = new SyncGrant({
    serviceSid: SERVICE_SID
  });

  const accessToken = new AccessToken(
    ACCOUNT_SID,
    API_KEY,
    API_SECRET
  );

  accessToken.addGrant(syncGrant);
  accessToken.identity = IDENTITY;
  const response = { token: accessToken.toJwt() }
  callback(null, response);
}
