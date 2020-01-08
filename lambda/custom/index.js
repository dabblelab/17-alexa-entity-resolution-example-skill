/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Hello there. How would you say we\'re doing as a company?';
    const repromptText = 'Can you tell me how you think we\'re doing?';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(repromptText)
      .withSimpleCard('Example Card Title', "Example card body content.")
      .getResponse();
  },
};

const RatingIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'RatingIntent';
  },
  handle(handlerInput) {

    const responseBuilder = handlerInput.responseBuilder;
    
    let speechText = `I'm not sure what that means.`;
    const ratingSlot = handlerInput.requestEnvelope.request.intent.slots.rating.value;

    if (ratingSlot) { 

      let resolution = handlerInput.requestEnvelope.request.intent.slots.rating.resolutions.resolutionsPerAuthority[0];

      if (resolution.status.code === "ER_SUCCESS_MATCH") {
        let id = resolution.values[0].value.id;
        speechText = `I heard you say we're doing ${ratingSlot}. On a scale of one to three, that's a ${id}.`;
      } 

    } else {
      speechText = `I'm not sure what that means. Could you say that another way?`
      responseBuilder.reprompt(`Could you say that another way?`)
    }

    return responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can rate us by saying how you think we\'re doing as a company. Say something like: I think you\'re doing great.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak(`Sorry, an error occurred. The error message was ${error.message}. Please say something else or repeat to recreate the error again.`)
      .reprompt('Please say something else or repeat to recreate the error again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    RatingIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
