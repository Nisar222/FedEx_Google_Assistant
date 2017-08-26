'use strict'

const API_URL = require('../../conf/track-bot').API.URL;
const request = require('request');
const dictionary = require('../../dictionary').dictionary;
const countries = require('country-data').countries

var apiKey = require('../../conf/track-bot').EASYPOST.APIKEY;
var easypost = require('node-easypost')(apiKey);


function getTracking(trackingData, callback) {

	var trackInfo = {
		tracking_code: trackingData[1],
		carrier: trackingData[0]
	}

	easypost.Tracker.create(trackInfo, function(error, response) {
		if (error) {
			console.log('Error: ', error);
			return callback(dictionary.str_errorFound + " '" + error.message.message + "'");
		}

		return callback(processTracking(response));
	});
}

function processTracking(json) {
	console.log('JSON: ', JSON.stringify(json));
	var response = '';
	var receiver = json.signed_by;
	var trkDetails = json.tracking_details[json.tracking_details.length - 1];

	var status = '';
	var date = '';
	var city = '';
	var country = '';

	if (trkDetails) {
		var status = trkDetails.status ? trkDetails.status : '';
		var date = trkDetails.datetime ? trkDetails.datetime : '';
		var city = trkDetails.tracking_location.city ? trkDetails.tracking_location.city : '';
		var country = trkDetails.tracking_location.country ? trkDetails.tracking_location.country : '';
	}else{
		var status = receiver ? 'Delivered' : 'In transit';
		var date = json.updated_at ? json.updated_at : '';
		var city = json.carrier_detail && json.carrier_detail.destination_location ? json.carrier_detail.destination_location  : '';
	}

	if (status) {
		var response = 'Your package status is ' + status;
	}
	if (date) {
		response += ' on ' + toHumanDate(date);
	}
	if (city) {
		response += ' in ' + city;
	}
	if (country) {
		response += ', ' + country;
	}
	if (receiver) {
		response += response ? '. And was received by: ' + receiver : 'Your package was received by: ' + receiver;
	}

	if (response) {
		return response;
	} else {
		return dictionary.str_trackingNotFound;
	}
}


function toHumanDate(date) {
	var month = new Array();
	month[0] = "January";
	month[1] = "February";
	month[2] = "March";
	month[3] = "April";
	month[4] = "May";
	month[5] = "June";
	month[6] = "July";
	month[7] = "August";
	month[8] = "September";
	month[9] = "October";
	month[10] = "November";
	month[11] = "December";

	var d = new Date(date);
	return d.getDate() + ' ' + month[d.getMonth()] + ' ' + d.getFullYear()
}

module.exports = {
	getTracking: getTracking
};