exports.handler = function(context, event, callback) {
  let jwt = require('jsonwebtoken')

  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'POST');
  response.appendHeader('Content-Type', 'application/json');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

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
                                       confName: conferenceSid }),
        }).then((task) => {
          const body = { workflowFriendlyName: task.workflowFriendlyName,
                         assignmentStatus: task.assignmentStatus,
                         taskChannelUniqueName: task.taskChannelUniqueName,
                         priority: task.priority };

          response.setBody(body)
          callback(null, response)
        });
    }
  })
};
