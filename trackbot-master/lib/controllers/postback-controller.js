'use strict'

const facebookController = require('./facebook-controller');
const dictionary = require('../../dictionary').dictionary;

function handleEvent(event, sender) {
	var payload = event.postback.payload;

	if (payload === 'getTracking') {
		resetBotStatus();
		facebookController.showCarrierMenu(sender);
	} else if (payload === 'doNothing') {
		resetBotStatus();
		facebookController.showCustomMessage(sender, dictionary.str_doNothingResponse);
	}
}


module.exports = {
	handleEvent: handleEvent
};