const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = express();
const APP_SECRET = require('./conf/track-bot').MESSENGER.APP_SECRET;

app.set('port', process.env.PORT || 5000);
app.set('view engine', 'ejs');
app.use(bodyParser.json({ verify: verifyRequestSignature }));
app.use(express.static('public'));

global.waitingForTracking = false;
global.trackingData = [];
global.resetBotStatus = function(){
  waitingForTracking = false;
  trackingData = [];  
}

app.get('/', function(req, res) {
	res.send('hello world');
});

require('./lib/routes/webhook')(app);

app.listen(process.env.PORT || 5000, function() {
	console.log('listening on port: ', process.env.PORT || 5000);
});

/* 
 * Verify that the callback came from Facebook. Using the App Secret from 
 * the App Dashboard, we can verify the signature that is sent with each 
 * callback in the x-hub-signature field, located in the header.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
function verifyRequestSignature(req, res, buf) {
  var signature = req.headers["x-hub-signature"];

  if (!signature) {
    // For testing, let's log an error. In production, you should throw an 
    // error.
    console.error("Couldn't validate the signature.");
  } else {
    var elements = signature.split('=');
    var method = elements[0];
    var signatureHash = elements[1];

    var expectedHash = crypto.createHmac('sha1', APP_SECRET)
                        .update(buf)
                        .digest('hex');

    if (signatureHash != expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}