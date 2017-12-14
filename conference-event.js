exports.handler = function(context, event, callback) {
  let response = new Twilio.Response()

  console.log('*********************************************************')
  console.log('*********************************************************')
  console.log('*************** CONFERENCE EVENT ************************')
  console.log(event.body)
  const client = context.getTwilioClient();
  const callerSid = event.call_sid

  // This method of putting call sid in the URI does not allow you to reconnect a calls
  //  to customer if customer drops
  if (callerSid === event.body.CallSid && event.body.StatusCallbackEvent == 'participant-leave') {
    console.log("CALLER HUNG UP.  KILL CONFERENCE")
    client.api.accounts(context.ACCOUNT_SID)
      .conferences(event.body.ConferenceSid)
      .fetch()
      .then((conference) => {
        console.log(conference)
        if (conference) {
          conference.update({status: "completed"})
          .then((conference) => {
            console.log("successfully closed conference"))
            response.setBody({result: "success", message: "successfully closed conference"})
            callback(null, response)
          }
        }
      })
      .catch((error) => {
        response.setBody({result: "error", message: error.message})
        callback(null, response)
      })
  }

  callback(null, response)
};
