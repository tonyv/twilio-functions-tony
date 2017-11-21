exports.handler = function(context, event, callback) {
  var taskAttributes = event.TaskAttributes;
  var workerAttributes = event.WorkerAttributes;
  var instructions = {}

    if (workerAttributes.skills) {
    if (workerAttributes.skills[0] == 'voicemail') {
      instructions = {"instruction": "redirect",
                      "call_sid": taskAttributes.call_sid,
                      "url":  'https://handler.twilio.com/twiml/EHdc2173198e8793cecd40420c94e562d4'}
    }
  }

  callback(null, instructions);
};
