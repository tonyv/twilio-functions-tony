exports.handler = function(context, event, callback) {
  let jwt = require('jsonwebtoken')
  let response = new Twilio.Response()

  const conferenceSid = event.sid
  const token = event.token
  const client = context.getTwilioClient();
  const agent_id = event.agent_id

  jwt.verify(token, context.AUTH_TOKEN, function(err, decoded) {
    if(err) {
      response.appendHeader('Status', 401)
      callback(null, response)
    } else {

      client.taskrouter.v1
        .workspaces(context.TWILIO_WORKSPACE_SID)
        .tasks
        .create({
          workflowSid: context.TWILIO_WORKFLOW_SID,
          taskChannel: 'voice',
          attributes: JSON.stringify({ type: "transfer",
                                       agent_id: agent_id,
                                       confName: req.body.confName}),
        }).then((task) => {
          const body = { workflowFriendlyName: task.workflowFriendlyName,
                         assignmentStatus: task.assignmentStatus,
                         taskChannelUniqueName: task.taskChannelUniqueName,
                         priority: task.priority };

          res.send(body);
        });
    }
  })
};
