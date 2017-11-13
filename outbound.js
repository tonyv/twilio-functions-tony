exports.handler = function(context, event, callback) {

  const from = req.body.From
  const to = req.body.To
  const agent = req.body.Agent
  const client = context.getTwilioClient();

  client.taskrouter.v1
    .workspaces(config.workspaceSid)
    .tasks
    .create({
      workflowSid: config.workflowSid,
      taskChannel: 'custom1',
      attributes: JSON.stringify({direction:"outbound", agent_name: 'bcoyle', from: from, to: to}),
    }).then((task) => {
      console.log(task)
    })
    res.send({});
};
