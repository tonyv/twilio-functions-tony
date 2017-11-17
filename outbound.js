exports.handler = function(context, event, callback) {
  let response = new Twilio.Response()
  let jwt = require('jsonwebtoken');

  const from = event.From
  const to = event.To
  const agent = event.Agent
  const token = event.Token
  const client = context.getTwilioClient()

  jwt.verify(token, context.AUTH_TOKEN, function(err, decoded) {
    if (err) {
      response.appendHeader('Status', 401)
      callback(null, response)
    } else {
      response.appendHeader('Status', 200)
      client.taskrouter.v1
        .workspaces(context.TWILIO_WORKSPACE_SID)
        .tasks
        .create({
          workflowSid: context.TWILIO_WORKFLOW_SID,
          taskChannel: 'custom1',
          attributes: JSON.stringify({direction:"outbound", agent_name: 'tony', from: from, to: to}),
        }).then((task) => {
          //console.log(task)
          callback(null, response)
        })
    }
  })
};
