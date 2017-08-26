'use strict'

const request = require('request');
const pageToken = require('../../conf/track-bot').MESSENGER.PAGE_ACCESS_TOKEN;
const dictionary = require('../../dictionary').dictionary;
const async = require('async');


function showResults(user, message) {
	let result = {
		text: message
	}

	async.waterfall([
		function(callback) {
			// arg1 now equals 'one' and arg2 now equals 'two'
			makeRequest(user, result, (error) => {
				if (error) {
					console.log(error)
					callback(error)
				} else {
					console.log('request ok')
					callback(null)
				}
			});
		},
		function(callback) {
			showCarrierMenu(user, dictionary.str_useInvitationRepeat);
			callback(null)
		}
	]);
}

function showCarrierMenu(user, text) {
	let messageData = {
		"text": text,
		"quick_replies": [{
			"content_type": "text",
			"title": dictionary.str_carrierFedex,
			"payload": "carrier-FedEx"
		}, {
			"content_type": "text",
			"title": dictionary.str_carrierUPS,
			"payload": "carrier-UPS"
		}, {
			"content_type": "text",
			"title": dictionary.str_carrierDHL,
			"payload": "carrier-DHLExpress"
		}, {
			"content_type": "text",
			"title": dictionary.str_carrierTNT,
			"payload": "carrier-TNTExpress"
		}]
	};


	makeRequest(user, messageData, (error) => {
		if (error) {
			console.log(error)
		} else {
			console.log('request ok')
		}
	});
}


function showCustomMessage(user, message) {
	let messageData = {
		text: message
	}
	makeRequest(user, messageData, (error) => {
		if (error) {
			console.log(error);
		} else {
			console.log('request ok');
		}
	});
}

function whatYouWannaDo(user, text) {
	let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "button",
				"text": dictionary.str_startConversation,
				"buttons": [{
					"type": "postback",
					"title": dictionary.str_getTracking,
					"payload": "getTracking"
				}, {
					"type": "postback",
					"title": dictionary.str_doNothing,
					"payload": "doNothing"
				}]
			}
		}
	};


	makeRequest(user, messageData, (error) => {
		if (error) {
			console.log(error)
		} else {
			console.log('request ok')
		}
	});
}

function makeRequest(user, messageData, callback) {
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {
			access_token: pageToken
		},
		method: 'POST',
		json: {
			recipient: {
				id: user
			},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			callback('Error sending message: ', error);
		} else if (response.body.error) {
			callback('Body Error: ', response.body.error);
		} else {
			callback(null);
		}
	});
}

module.exports = {
	showCustomMessage: showCustomMessage,
	showCarrierMenu: showCarrierMenu,
	whatYouWannaDo: whatYouWannaDo,
	showResults: showResults
};