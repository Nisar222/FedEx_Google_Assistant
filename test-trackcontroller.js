const express = require('express')

const trackingController = require('./lib/controllers/tracking-controller')
const app = express()
const respond = {
"speech": "Your Package was delivered to Nisar Ahmed Khan in FedEx",
"displayText": "Barack Hussein Obama II was the 44th and current President of the United States, and the first African American to hold the office. Born in Honolulu, Hawaii, Obama is a graduate of Columbia University   and Harvard Law School, where ",
"data": "data",
"contextOut": "Track",
"source": "FedEx.com"
}

JSON.stringify(respond);

app.get('/', function (req, res) {
  var reply2 = trackingController.getTracking();
  //console.log(reply2);
});

app.post('/', function(req, res) {
  console.log(req.fulfillment.speech)

  /*
  res.json(respond);
  console.log(respond)
  
  */
});


app.listen( 3000, function () {
  console.log('Example app listening on port',  process.env.PORT)
})