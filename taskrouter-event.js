exports.handler = function(context, event, callback) {
  // console.log('*********************************************************')
  // console.log('*********************************************************')
  // console.log('*************** TASKROUTER EVENT ************************')
  // console.log(`${event.EventType} --- ${event.EventDescription}`)

  const client = context.getTwilioClient();
  const service = client.sync.services(context.TWILIO_SYNC_SERVICE_SID);

  const task_removal_events = ['task.completed', 'task.canceled', 'task.deleted', 'task.timeout', 'task.wrapup']

  if (event.ResourceType == 'worker') {
    const worker = event;
    service.syncMaps('current_workers')
      .syncMapItems(worker.WorkerSid).update({
        data: {
          name: worker.WorkerName,
          activity: worker.WorkerActivityName
        }
      }).then(function(res) {
        callback(null, {})
      }).catch(function(error) {
        callback(error)
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
        }).then(function(res) {
          callback(null, {})
        }).catch(function(error) {
          console.log(error)
          callback(error)
        });
    } else if(task.EventType == 'task.updated') {
        service.syncMaps('current_tasks')
          .syncMapItems(task.TaskSid).update({
            data: {
              status: task.TaskAssignmentStatus
            }
          }).then(function(res) {
            callback(null, {})
          }).catch(function(error) {
            console.log(error);
            callback(error)
          });
    } else if(task_removal_events.includes(task.EventType)) {
        service.syncMaps('current_tasks')
          .syncMapItems(task.TaskSid)
          .remove()
          .then(function(res) {
            callback(null, {})
          }).catch(function(error) {
            console.log(error);
            callback(error)
          });
    }
  }
};
