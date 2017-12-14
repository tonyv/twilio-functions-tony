exports.handler = function(context, event, callback) {
  let jwt = require('jsonwebtoken');

  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'POST');
  response.appendHeader('Content-Type', 'application/json');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');


  const worker = event.workerSid;
  const taskrouter = Twilio.jwt.taskrouter;
  const util = Twilio.jwt.taskrouter.util;
  const TaskRouterCapability = taskrouter.TaskRouterCapability;

  const capability = new TaskRouterCapability({
    accountSid: context.ACCOUNT_SID,
    authToken: context.AUTH_TOKEN,
    workspaceSid: context.TWILIO_WORKSPACE_SID,
    channelId: worker,
    ttl: 2880});

  // Event Bridge Policies
  var eventBridgePolicies = util.defaultEventBridgePolicies(context.ACCOUNT_SID, worker);

  var workspacePolicies = [
    // Workspace fetch Policy
    buildWorkspacePolicy({}, context),
    // Workspace Activities Update Policy
    buildWorkspacePolicy({ resources: ['Activities'], method: 'POST' }, context),
    buildWorkspacePolicy({ resources: ['Activities'], method: 'GET' }, context),
    //

    buildWorkspacePolicy({ resources: ['Tasks', '**'], method: 'POST'  }, context),
    buildWorkspacePolicy({ resources: ['Tasks', '**'], method: 'GET' }, context),
    // Workspace Activities Worker Reserations Policy
    buildWorkspacePolicy({ resources: ['Workers', worker, 'Reservations', '**'], method: 'POST' }, context),
    buildWorkspacePolicy({ resources: ['Workers', worker, 'Reservations', '**'], method: 'GET' }, context),
    // Worker Channels
    buildWorkspacePolicy({ resources: ['Workers', worker, 'Channels', '**'], method: 'POST' }, context),
    buildWorkspacePolicy({ resources: ['Workers', worker, 'Channels', '**'], method: 'GET' }, context),

    // Worker  Policy
    buildWorkspacePolicy({ resources: ['Workers', worker], method: 'GET' }, context),
    buildWorkspacePolicy({ resources: ['Workers', worker], method: 'POST' }, context),
  ];

  eventBridgePolicies.concat(workspacePolicies).forEach(function (policy) {
    capability.addPolicy(policy);
  });

  response.setBody({token: capability.toJwt()});

  console.log(response.body);

  callback(null, response);
}


// Helper function to create Policy for TaskRouter token

function buildWorkspacePolicy(options, context) {
  const taskrouter = Twilio.jwt.taskrouter;
  const TaskRouterCapability = taskrouter.TaskRouterCapability;
  const Policy = TaskRouterCapability.Policy;

  options = options || {};
  var version = 'v1';
  var resources = options.resources || [];

  const TASKROUTER_BASE_URL = 'https://' + 'taskrouter.twilio.com';

  var urlComponents = [TASKROUTER_BASE_URL, version, 'Workspaces', context.TWILIO_WORKSPACE_SID]

  return new Policy({
    url: urlComponents.concat(resources).join('/'),
    method: options.method || 'GET',
    allow: true
  });
}
