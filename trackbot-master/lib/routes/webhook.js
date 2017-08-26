'use strict';

const validToken = require('../../conf/track-bot').MESSENGER.VALIDATION_TOKEN;
const postbackController = require('../controllers').postbackController;
const messagingController = require('../controllers').messagingController;

module.exports = function(app) {
	app.get('/webhook/', function(req, res) {
		if (req.query['hub.verify_token'] === validToken) {
			res.send(req.query['hub.challenge']);
		} else {
			res.send('Error, wrong validation token');
		}
	});

	app.post('/webhook/', function(req, res) {
		let messaging_events = req.body.entry[0].messaging;
		for (var i = 0; i < messaging_events.length; i++) {
			let event = req.body.entry[0].messaging[i];
			let sender = event.sender.id;
			if (event.postback) {
				postbackController.handleEvent(event, sender);
				continue;
			}
			if (event.message && event.message.text) {
				messagingController.handleEvent(event, sender);
				continue;
			}
		}
		res.sendStatus(200);
	});
};