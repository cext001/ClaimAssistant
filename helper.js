const request = require('request');

module.exports = {
    "getClaimStatus": function (claimId) {
        console.log('InsideHelper Claim Id:',claimId);
        //return new Promise(function (resolve, reject) {
            var options = {
                method: 'POST',
                url: 'http://35.154.116.87:8080/cc/service/edge/claim/vhv',
                headers: { 'cache-control': 'no-cache', authorization: 'Basic c3U6Z3c=', 'content-type': 'application/json' },
                body: { jsonrpc: '2.0', method: 'getClaimSummary', params: [claimId] },
                json: true
            };
            request(options, function (error, response, body) {
                console.log('error:',error);
                console.log('body:',body);
                console.log('response:',response);
                var speechOutput =[];
                if (error) {
                    console.log(error);
                    speechOutput = ["<s>Something went wrong. Please try again</s>"];
                    //resolve(speechOutput);
                    return speechOutput;
                } else {
                    if(body.error){
                        console.log('Inside body error',body.error.message);
                        speechOutput = ['<s>'+body.error.message+'</s>'];
                    } else {
                        speechOutput = ["<s>According to our records, the current status of claim with ID <break strength=\"medium\" /> <say-as interpret-as=\"digits\"> 231233 </say-as>, is " + body.result.currentClaimStatus + ".</s>"];
                        if (body.result.currentClaimStatus === "On Hold") {
                            speechOutput.push('<s>The reason for the same is <break strength=\"medium\" />' + body.result.reason + '.</s>');
                        }
                    }                
                    console.log(speechOutput);
                    //resolve(speechOutput);
                    return speechOutput;
                }
            });
        //})
    }
};