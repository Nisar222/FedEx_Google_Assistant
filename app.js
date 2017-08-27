/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const trackingController = require('./lib/controllers/tracking-controller')

const restService = express();
restService.use(bodyParser.json());

//Say hi on a get request.. to see if service is answering

restService.get('/', function (req, res) {
    res.send('Hi, I am a FedEx Google assistant app' )
  })

restService.post('/', function (req, res) {

    console.log('hook request');

    try {
        var speech = 'empty speech';

        if (req.body) {
            var requestBody = req.body;

            if (requestBody.result) {
                speech = '';

                if (requestBody.result.fulfillment) {
                    speech += requestBody.result.fulfillment.speech;
                    speech += ' ';
                }

                if (requestBody.result.action) {
                    speech += 'action: ' + requestBody.result.action;
                }
                
                if (requestBody.result.action == 'track.package' && requestBody.result.parameters.TrackingNumber !='' ) {
                   // If we have a tracking number, do this..
                   //First check if the number is 12 digits, otherwise throw error
                    //remove non numeric charachters from Tracking Number before passing it ti easypost
                    var AWB = (requestBody.result.parameters.TrackingNumber).replace(/\D/g,'');
                    // TEST NUMBERIZE - WORKED FINE 
                    console.log('Numberize Tracking no:' + AWB);

                            if (AWB.length != 12 || !/^\d+$/.test(AWB)) {
                                
                                //reply with an error
                                speech = 'Sorry, Your tracking number is incorrect, please try again'
                                return res.json({
                                    speech: speech,
                                    displayText: speech,
                                    source: 'apiai-webhook-sample'
                                });

                            } else {
                                trackPackage(AWB, function(speech){
                                    console.log('status = ' + speech);
                                    //res.send()
                                    return res.json({
                                        speech: speech,
                                        displayText: speech,
                                        source: 'trackbot-google-assistant webhook'
                                    });
            
                            });
                            }
                }
                
            }
        }

        // console.log('result: ', speech);

        // return res.json({
        //     speech: speech,
        //     displayText: speech,
        //     source: 'apiai-webhook-sample'
        // });
    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
});

function trackPackage(trackingNumber, callback) {
  var trackingData = {
    tracking_code: trackingNumber,
    carrier: 'FedEx' 
  };
    trackingController.getTracking(trackingData, function(result) {
      console.log(result);
      callback(result);
      // return result;
    });
}

		
restService.listen((process.env.PORT || 3000), function () {
    console.log("Server listening on " + process.env.PORT );
});