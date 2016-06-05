/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/*
 * This is an Alexa Skill that allows the user to call 911 using covert voice commands or to send a text for help
 */

/**
 * App ID for the skill
 */
var APP_ID = 'amzn1.echo-sdk-ams.app.fef17d48-31fd-4be5-8186-22fe501fd380'; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

// Let's import the twilio functions
var twilioClient = require('./caller');
// The to and from numbers for Twilio
var toNum = '+REMOVE NUMBER FOR SECURITY REASONS',
    fromNum = '+REMOVE NUMBER FOR SECURITY REASONS',
    twiMLUrl = 'https://demo.twilio.com/welcome/voice/';
    testNum = '+REMOVE NUMBER FOR SECURITY REASONS';

/**
 * HelloWorld is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var SafeSteal = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
SafeSteal.prototype = Object.create(AlexaSkill.prototype);
SafeSteal.prototype.constructor = SafeSteal;

SafeSteal.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("SafeSteal onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

SafeSteal.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("SafeSteal onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Hello, you have an appointment at 6pm.";
    var repromptText = "You can say hello";
    response.ask(speechOutput, repromptText);
};

SafeSteal.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("SafeSteal onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

SafeSteal.prototype.intentHandlers = {
    // register custom intent handlers
    "CallEmergencyIntent": function (intent, session, response) {
        handleCallEmergencyRequest(intent, session, response);
    },
    "TextAFriendIntent": function(intent, session, response) {
        handleTextAFriendRequest(intent, session, response);
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can say hello to me!", "You can say hello to me!");
    },
    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

function handleCallEmergencyRequest(intent, session, response) {
    var speechText = "Hello sir or madam, please do not be alarmed. Being a criminal does not mean you need to be a killer. Go ahead and take everything in this house. Thank you for your cooperation today. It was a pleasure.",
        cardTitle = "Steal No Kill",
        cardContent = speechText;
    var speechOutput = {
        speech: speechText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };

    twilioClient.callMe(toNum, fromNum, twiMLUrl, function(result) {
        console.log(result);
        response.tellWithCard(speechOutput, cardTitle, cardContent);
    });
}

function handleTextAFriendRequest(intent, session, response) {
    var speechText = "I understand you need to rob this house, everyone has their own circumstances. However, there is no need to resort to violence. Just take all the jewelry and leave.",
        cardTitle = "Steal No Kill",
        cardContent = speechText,
        repromptText = "Are you still robbing this house?",
        messageBody = "Someone is robbing your house right now. Please call 911 and request help. This is not a joke.";

    var speechOutput = {
        speech: speechText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };

    var repromptOutput = {
        speech: repromptText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    
    twilioClient.textMe(toNum, fromNum, messageBody, function(result) {
        console.log(result);
        response.askWithCard(speechOutput, repromptOutput, cardTitle, cardContent);
    });
    
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the SafeSteal skill.
    var safeSteal = new SafeSteal();
    safeSteal.execute(event, context);
};
