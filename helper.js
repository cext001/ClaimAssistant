const request = require('request'),
    config = require('./config');

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July','August','September','October','November','December'];

module.exports = {
    "getClaimStatus": function (claimId) {
        var speechOutput = [];
        console.log('InsideHelper Claim Id:', claimId);
        return new Promise(function (resolve, reject) {
            var options = {
                method: 'POST',
                url: config.claimStatusApiURL,
                headers: { 'cache-control': 'no-cache', authorization: 'Basic c3U6Z3c=', 'content-type': 'application/json' },
                body: { jsonrpc: '2.0', method: 'getClaimSummary', params: [claimId] },
                json: true
            };
            request(options, function (error, response, body) {
                if (error) {
                    console.log(error);
                    speechOutput = ["<s>Something went wrong. Please try again</s>"];
                    resolve(speechOutput);
                } else {
                    if (body.error) {
                        console.log('Inside body error', body.error.message);
                        if (body.error.message == 'No Claim entity found')
                            speechOutput = ['<s>The claim number is not found.Please enter a valid one</s>'];
                    } else {
                        speechOutput = ["<s>According to our records, the current status of claim with ID <break strength=\"medium\" /> <say-as interpret-as=\"digits\"> " + claimId + " </say-as>, is " + body.result.currentClaimStatus + ".</s>"];
                        if (body.result.currentClaimStatus === "On Hold") {
                            speechOutput.push('<s>The reason for the same is <break strength=\"medium\" />' + body.result.reason + '.</s>');
                        }
                    }
                    console.log(speechOutput);
                    resolve(speechOutput);
                }
            });
        })
    },
    "getClaimPaymentDetails": function (claimId) {
        console.log('inside getClaimPaymentDetails');
        var speechOutput = [];
        return new Promise(function (resolve, reject) {
            var options = {
                method: 'POST',
                url: config.claimStatusApiURL,
                headers: { authorization: 'Basic c3U6Z3c=', 'content-type': 'application/json' },
                body: { jsonrpc: '2.0', method: 'getClaimPaymentDetails', params: ['000-00-006906'] },
                json: true
            };
            request(options, function (error, response, body) {
                if (error) {
                    console.log(error);
                    speechOutput = ["<s>Something went wrong. Please try again</s>"];
                    resolve(speechOutput);
                }
                console.log(body);
                resolve(body);
            });
        });
    },
    "getRentalCarStatus": function (claimId) {
        var speechOutput = [];
        console.log('InsideHelper Claim Id:', claimId);
        return new Promise(function (resolve, reject) {
            var options = {
                method: 'POST',
                url: config.claimStatusApiURL,
                headers: { 'cache-control': 'no-cache', authorization: 'Basic c3U6Z3c=', 'content-type': 'application/json' },
                body: { jsonrpc: '2.0', method: 'rentalCarBookingStatus', params: [claimId] },
                json: true
            };
            request(options, function (error, response, body) {
                if (error) {
                    console.log(error);
                    speechOutput = ["<s>Something went wrong. Please try again</s>"];
                    resolve(speechOutput);
                } else {
                    if (body.error) {
                        console.log('Inside body error', body.error.message);
                        if (body.error.message == 'No Claim entity found')
                            speechOutput = ['<s>The claim number is not found.Please enter a valid one</s>'];
                    } else {                        
                        if (body.result[0].bookingStatus) {
                            var rentStartDate = new Date (body.result[0].bookingStartDate);
                            console.log('rentstartdate',rentStartDate);
                            var month = months[rentStartDate.getMonth()];
                            speechOutput = ['<s> The car has been booked with the Rental agency <break strength=\"medium\" /> '+body.result[0].agency +' and the reservation number is <say-as interpret-as=\"spell-out\">'+body.result[0].reservationID+'</say-as>. </s>'];
                            speechOutput.push('<s> The car will be delivered on<break strength=\"medium\" />' + month + '<say-as interpret-as="ordinal">'+rentStartDate.getDate()+'</say-as> 9AM</s>');
                        }
                        else{
                            speechOutput = ['<s> The car has not been booked </s>'];
                        }
                    }
                    console.log(speechOutput);
                    resolve(speechOutput);
                }
            });
        })
    }
};