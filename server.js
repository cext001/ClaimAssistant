'use strict';

const express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    alexa = require('alexa-app'),
    app = express(),
    alexaApp = new alexa.app("claim")

alexaApp.express({
    expressApp: app,
    checkCert: false
});

alexaApp.error = function (e, req, res) {
	console.log("Error in Alexa");
    console.log(e);
    console.log(req);
    throw e;
};

//Simple card
alexaApp.card = function (current) {
    console.log('createCard: current=', current);
    var card = {
        type: 'Simple',
        title: 'Quiz results'
    };
    
    card.content = content;
    return card;
};

//Standard card
alexaApp.standardCard = function () {
    var card = {
        type: 'Standard',
        title: 'Quiz results',
        text: 'Sample Text \n Line2',
        image: {
            smallImageUrl: 'https://cdn3.iconfinder.com/data/icons/phones-set-2/512/27-512.png',
            largeImageUrl: 'https://cdn3.iconfinder.com/data/icons/phones-set-2/512/27-512.png'
        }
    };
    return card;
};

//Account linking card
alexaApp.accountLinkingCard = function () {
    var card = {
        type: "LinkAccount"
    }
    return card;
}


alexaApp.launch(function (request, response) {
    console.log('launch ' + JSON.stringify(request));
    console.log('Session Obj ' + JSON.stringify(request.getSession().details.accessToken));
    console.log('Session Obj is new ' + request.getSession().isNew());
    var say = [];
    if (request.getSession().isNew()) {
                    say.push('<s>Hi </s>');
                    say.push('<s>Welcome to Claim Assistant. <break strength="medium" /></s>');   
                    say.push('<s>What i can do for you <break strength="medium" /></s>');  
                    response.shouldEndSession(false);
                    response.say(say.join('\n'));
                    response.send();
                
    } else {
        console.log('----Access Token not available----');
        response.say('<s>Node Saga requires you to link your google account.</s>');
    }
});

alexaApp.intent('AMAZON.HelpIntent', function (request, response) {
    response.say('Say repeat <break strength="medium" /> to hear the question again, or stop <break strength="medium" /> to end.');
    response.shouldEndSession(false);
});

alexaApp.stopOrCancel = function (request, response) {
    var current = JSON.parse(request.session('current') || '{}');
    var score = quiz.getScore(current);
    var say = ['Thanks for playing Node Saga'];
    if (Object.keys(current).length) {
        say.push('<s>You got ' + score + ' questions correct.</s>');
        response.card(alexaApp.card(current));
    }
    response.say(say.join('\n'));
};

alexaApp.intent('AMAZON.StopIntent', function (request, response) {
    alexaApp.stopOrCancel(request, response);
});

alexaApp.intent('AMAZON.CancelIntent', function (request, response) {
    alexaApp.stopOrCancel(request, response);
});

alexaApp.intent('CardIntent', function (request, response) {
    response.card(alexaApp.card(JSON.parse(request.session('current') || '{}')));
    response.say('Your results have been sent to the Alexa app.');
});

alexaApp.intent('RepeatIntent', function (request, response) {
    var q = quiz.getQuestion(request.session('q'));
    response.shouldEndSession(false, 'What do you think? Is it ' + q.choices() + '?');
    response.say(q.questionAndAnswers());
});

alexaApp.intent('claimStatusIntent', function (request, response) {
    var all = JSON.parse(request.session('all') || '{}');
    var say = ["<s>Please provide the claim i d. <break strength=\"medium\" /></s>"];
    response.shouldEndSession(false);
    response.say(say.join('\n'));
});

alexaApp.intent('AnotherIntent', function (request, response) {
    var all = JSON.parse(request.session('all') || '{}');
    var say = ["<s>Ok. Let's start another quiz. <break strength=\"medium\" /></s>"];
    say = say.concat(alexaApp.startQuiz(response, Object.keys(all)));
    response.say(say.join('\n'));
});

if (process.argv.length > 2) {
    var arg = process.argv[2];
    if (arg === '-s' || arg === '--schema') {
        console.log(alexaApp.schema());
    }
    if (arg === '-u' || arg === '--utterances') {
        console.log(alexaApp.utterances());
    }
}



const server = app.listen(process.env.PORT || 5000, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});