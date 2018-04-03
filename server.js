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
var claimStatusIntentCalled = false;
var rentalCarIntentCalled = false;
var repairPaymentIntentCalled = false;
var claimIdPresent = false;
var claimId = '';

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
    console.log('Session Obj ' + JSON.stringify(request.getSession()));
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


alexaApp.intent('claimStatusIntent', function (request, response) {
    var all = JSON.parse(request.session('all') || '{}');
    claimStatusIntentCalled = true;
    console.log(request.data.request.intent.slots)
    var say=[];
    
    if (request.data.request.intent.slots.claimId.value){
        claimId=request.data.request.intent.slots.claimId.value;
        console.log('claimId:'+claimId);
        claimIdPresent = true;
        getClaimStatus(claimId,function(responseText){
            say = responseText;
        });
    }
    else{
     say = ["<s>Please provide the claim number. <break strength=\"medium\" /></s>"];
    }
    response.shouldEndSession(false);
    response.say(say.join('\n'));
});

alexaApp.intent('repairPaymentIntent', function (request, response) {
    var all = JSON.parse(request.session('all') || '{}');
    repairPaymentIntentCalled = true;
    console.log('inside repairPaymentIntent');
    console.log(request.data.request.intent.slots)
    var say=[];
    
    if (request.data.request.intent.slots.claimId.value){
        claimId=request.data.request.intent.slots.claimId.value;
        console.log('claimId:'+claimId);
        claimIdPresent = true;
        getRepairPaymentStatus(claimId,function(responseText){
            say = responseText;
        });
    }
    else{
     say = ["<s>Please provide the claim number. <break strength=\"medium\" /></s>"];
    }
    response.shouldEndSession(false);
    response.say(say.join('\n'));
});

alexaApp.intent('claimIdIntent', function (request, response) {
    var all = JSON.parse(request.session('all') || '{}');
    var say =[];
    console.log(request.data.request.intent.slots.claimId.value)
    claimId=request.data.request.intent.slots.claimId.value;
    if(claimStatusIntentCalled){
        getClaimStatus(claimId,function(responseText){
            say = responseText;
        });
    }
    if(repairPaymentIntentCalled){
        getRepairPaymentStatus(claimId,function(responseText){
            say = responseText;
        });
    }
    response.shouldEndSession(false);
    response.say(say.join('\n'));
});


alexaApp.intent('thankIntent', function (request, response) {
    var all = JSON.parse(request.session('all') || '{}');
    var say =["<s> Happy to help you!</s>"];;
    response.shouldEndSession(true);
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

function getClaimStatus(claimId,callback){
    var say = ["<s> According to our records, the current status of claim with ID <break strength=\"medium\" /> <say-as interpret-as='digits'> "+ claimId +" </say-as>, is ,, “ON HOLD”.</s>"];
    say.push('<s> The reason for the same is <break strength=\"medium\" /> “Invoice Not Submitted”.</s>');
    say.push('<s> Once the invoice is submitted, it will take 5 working days for settlement.</s>');
    callback (say);
}

function getRepairPaymentStatus(claimId,callback){
    var say = ["<s> This claim is ,, “Paid in Full”.</s>"];
    say.push('<s> The amount of $150.55 is credited to your bank account number <break strength=\"medium\" /> ABC121212 </s>');
    say.push('<s> on 1st April 2018 at 3:00 PM GMT.</s>');
    callback (say);
}

const server = app.listen(process.env.PORT || 5000, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});