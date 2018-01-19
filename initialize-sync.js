exports.handler = function(context, event, callback) {
  let jwt = require('jsonwebtoken')
  const response = new Twilio.Response();
  const client = context.getTwilioClient();
  const service = client.sync.services(context.TWILIO_SYNC_SERVICE_SID);

  jwt.verify(token, context.AUTH_TOKEN, function(err, decoded) {
    if(err) {
      response.appendHeader('Status', 401)
      callback(null, response)
    } else {
      service.syncMaps
        .create({
          uniqueName: 'current_workers',
        })
        .then(response => {
          console.log(response);
          client.taskrouter.v1
            .workspaces(context.TWILIO_WORKSPACE_SID)
            .workers
            .list()
            .then((workers) => {
              workers.forEach((worker) => {
                service.syncMaps('current_workers')
                  .syncMapItems.create({
                    key: worker.sid,
                    data: {
                      name: worker.FriendlyName,
                      activity: worker.Activity,
                    }
                  }).then(function(response) {
                    console.log(response);
                  }).catch(function(error) {
                    console.log(error);
                  });
              });
            });
        })
        .catch(error => {
          console.log(error);
        });
    }
  })

  const body = { status: "ok" }
  response.setBody(body)
  callback(null, response)
}
