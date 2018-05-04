exports.handler = function(context, event, callback) {
  let response = new Twilio.Response()
  let jwt = require('jsonwebtoken');

  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
  response.appendHeader('Content-Type', 'application/json');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  const token = event.token
  const client = context.getTwilioClient()
  let myWorkflows = []

  jwt.verify(token, context.AUTH_TOKEN, function(err, decoded) {
    if (err) {
      response.appendHeader('Status', 401)
      callback(null, response)
    } else {
       response.appendHeader('Status', 200)
       client.taskrouter
          .workspaces(context.TWILIO_WORKSPACE_SID)
          .workflows.each((workflow) => {
            myWorkflows.push(workflow)
            if(myWorkflows.length > 2) {
                response.setBody({workflow: myWorkflows})
                callback(null, response)
            }
          });
    }
  })
};
