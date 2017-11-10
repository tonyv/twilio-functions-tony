exports.handler = function(context, event, callback) {
  const worker = 'WKa11a52ccad4388a1b34a4952239c3214';
  const taskrouter = Twilio.jwt.taskrouter;
  const util = Twilio.jwt.taskrouter.util;
  const TaskRouterCapability = taskrouter.TaskRouterCapability;

  const capability = new TaskRouterCapability({
    accountSid: context.ACCOUNT_SID,
    authToken: context.AUTH_TOKEN,
    workspaceSid: context.TWILIO_WORKSPACE_SID,
    channelId: worker,
    ttl: 3600});

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
    //

    // Workspace Activities Worker  Policy
    buildWorkspacePolicy({ resources: ['Workers', worker], method: 'GET' }, context),
    buildWorkspacePolicy({ resources: ['Workers', worker], method: 'POST' }, context),
  ];

  eventBridgePolicies.concat(workspacePolicies).forEach(function (policy) {
    capability.addPolicy(policy);
  });

  callback(null, capability.toJwt());
}


// Helper function to create Policy for TaskRouter token

function buildWorkspacePolicy(options, context) {
  const taskrouter = Twilio.jwt.taskrouter;
  const TaskRouterCapability = taskrouter.TaskRouterCapability;
  const Policy = TaskRouterCapability.Policy;

  options = options || {};
  var version = 'v1';
  var resources = options.resources || [];

  const TASKROUTER_BASE_URL = 'https://' + context.DOMAIN_NAME;

  var urlComponents = [TASKROUTER_BASE_URL, version, 'Workspaces', context.TWILIO_WORKSPACE_SID]

  return new Policy({
    url: urlComponents.concat(resources).join('/'),
    method: options.method || 'GET',
    allow: true
  });
}
