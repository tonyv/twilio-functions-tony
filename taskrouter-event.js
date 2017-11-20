exports.handler = function(context, event, callback) {
  console.log('*********************************************************')
  console.log('*********************************************************')
  console.log('*************** TASKROUTER EVENT ************************')
  console.log(`${req.body.EventType} --- ${req.body.EventDescription}`)
  console.log(req.body)

  const client = context.getTwilioClient();
  const service = client.sync.services(context.TWILIO_SYNC_SERVICE_SID);

  if (req.body.ResourceType == 'worker') {
    const worker = req.body

    service.syncMaps('current_workers')
      .syncMapItems(worker.WorkerSid).update({
        data: {
          name: worker.Workername,
          activity: worker.WorkerActivityName,
          timestamp: worker.Timestamp
        }
      }).then(function(response) {
        console.log("worker updated");
      }).catch(function(error) {
        console.log(error);
      });
  } else if (req.body.ResourceType == 'task') {
    const task = req.body

    if(task.EventType == 'task.created') {
      service.syncMaps('current_tasks')
        .syncMapItems.create({
          key: task.TaskSid,
          data: {
            status: task.TaskAssignmentStatus
          }
        }).then(function(response) {
          console.log("task created");
        }).catch(function(error) {
          console.log(error)
        });
    } else if(task.EventType == 'task.updated') {
        service.syncMaps('current_tasks')
          .syncMapItems(task.TaskSid).update({
            data: {
              status: task.TaskAssignmentStatus
            }
          }).then(function(response) {
            console.log("task updated");
          }).catch(function(error) {
            console.log(error);
          });
    }
  }

  callback(null, {})
};
