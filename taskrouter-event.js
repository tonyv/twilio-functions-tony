exports.handler = function(context, event, callback) {
  console.log('*********************************************************')
  console.log('*********************************************************')
  console.log('*************** TASKROUTER EVENT ************************')
  console.log(`${event.EventType} --- ${event.EventDescription}`)

  const client = context.getTwilioClient();
  const service = client.sync.services(context.TWILIO_SYNC_SERVICE_SID);
  const task_removal_events = ['task.completed', 'task.canceled', 'task.deleted', 'task.timeout']
  const task_status_events = ['task.updated', 'task.wrapup']

  if (event.ResourceType == 'worker') {
    const worker = event;

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
  } else if (event.ResourceType == 'task') {
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
    } else if(task_status_events.includes(task.EventType)) {
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
    } else if(task_removal_events.includes(task.EventType)) {
        service.syncMaps('current_tasks')
          .syncMapItems(task.TaskSid)
          .remove()
          .then(function(response) {
            console.log(task.EventType + ' event received => task removed');
          }).catch(function(error) {
            console.log(error);
          });
    }
  }

  callback(null, {})
};
