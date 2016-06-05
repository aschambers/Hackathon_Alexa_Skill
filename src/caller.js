var accountSid = 'REMOVED FOR SECURITY REASONS',
    authToken = 'REMOVED FOR SECURITY REASONS';
var client = require('twilio')(accountSid, authToken);

function textMe(to, fromNum, messageBody, callback) {
	var textObj = {
		to: to,
		from: fromNum,
		body: messageBody
	};

	client.sendMessage(textObj, function(err, responseData) {
		if (!err) {
			console.log(responseData.from);
			callback(responseData.body);
		} else {
			callback({});
		}
	});
}

function callMe(to, fromNum, twiUrl, callback) {
	var callObj = {
		to: to,
		from: fromNum,
		url: twiUrl
	};

	client.makeCall(callObj, function(err, responseData) {
		if (err) {
			console.log(JSON.stringify(err));
			callback({});
		} else {
			callback(callObj);
		}
	});
}

module.exports = {
	textMe: textMe,
	callMe: callMe
};
