exports.handler = function(context, event, callback) {
  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'GET');
  response.appendHeader('Content-Type', 'application/json');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  const client = context.getTwilioClient();
  const service = client.sync.services(context.TWILIO_SYNC_SERVICE_SID);

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
            console.log(worker.sid)
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

  const body = { status: "ok" }
  response.setBody(body)
  callback(null, response)
}
