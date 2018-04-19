exports.handler = function(context, event, callback) {
  let jwt = require('jsonwebtoken')

  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'POST');
  response.appendHeader('Content-Type', 'application/json');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  const conferenceSid = event.conferenceSid
  const token = event.token
  const client = context.getTwilioClient();
  const department = event.department

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
          taskChannel: "voice",
          attributes: JSON.stringify({ conversations: {
                                        conversation_id: conferenceSid,
                                        department: department
                                      },
                                      department: department,
                                      confName: conferenceSid }),
        }).then((task) => {
          const body = { taskSid: task.sid };

          response.setBody(body)
          callback(null, response)
        });
    }
  })
}
