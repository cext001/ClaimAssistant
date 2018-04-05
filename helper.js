const request = require('request'),
config = require('./config');

module.exports = {
    "getClaimStatus": function (claimId) {
        var speechOutput =[];
        console.log('InsideHelper Claim Id:',claimId);
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
                    if(body.error){
                        console.log('Inside body error',body.error.message);
                        speechOutput = ['<s>'+body.error.message+'</s>'];
                    } else {
                        speechOutput = ["<s>According to our records, the current status of claim with ID <break strength=\"medium\" /> <say-as interpret-as=\"digits\"> "+claimId+" </say-as>, is " + body.result.currentClaimStatus + ".</s>"];
                        if (body.result.currentClaimStatus === "On Hold") {
                            speechOutput.push('<s>The reason for the same is <break strength=\"medium\" />' + body.result.reason + '.</s>');
                        }
                    }                
                    console.log(speechOutput);
                    resolve(speechOutput);
                }
            });
        })
    }
};