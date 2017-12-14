// This function should Check for valid Twilio signature

exports.handler = function(context, event, callback) {
  const resp = new Twilio.twiml.VoiceResponse();
  const attributes = {skill: 'customer_care', type: 'inbound' };
  const priority = '1'
  const json = JSON.stringify(attributes);

  resp.enqueueTask({
    workflowSid: context.TWILIO_WORKFLOW_SID,
  }).task({priority: priority}, json)

  callback(null, resp);
};
