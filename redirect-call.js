exports.handler = function(context, event, callback) {
  console.log(event)
  let jwt = require('jsonwebtoken')

  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', '*');
  response.appendHeader('Content-Type', '*');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  const callSid = event.callSid
  const taskSid = event.taskSid
  const client = context.getTwilioClient();

    client.calls(callSid)
      .update({method: 'POST', url: 'https://white-leopard-4088.twil.io/conference?taskSid=' + taskSid})
      .then((call) => {
        //response.setBody({})
        callback(null, response)
      })
      .done();

}
