const request = require('request');

module.exports = {
    "getClaimStatus": function (claimId) {
        return new Promise(function (resolve, reject) {
            var options = {
                method: 'POST',
                url: 'http://35.154.116.87:8080/cc/service/edge/claim/vhv',
                headers: { 'cache-control': 'no-cache', authorization: 'Basic c3U6Z3c=', 'content-type': 'application/json' },
                body: { jsonrpc: '2.0', method: 'getClaimSummary', params: [claimId] },
                json: true
            };
            request(options, function (error, response, body) {
                var speechOutput;
                if (error) {
                    speechOutput = (typeof (error) === 'object') ? txtMsg = JSON.stringify(error) : txtMsg = error;
                    resolve(speechOutput);
                } else {
                    speechOutput = ["<s> According to our records, the current status of claim with ID <break strength=\"medium\" /> <say-as interpret-as='digits'> " + claimId + " </say-as>, is , "+body.result.currentClaimStatus+".</s>"];
                    speechOutput.push('<s> The reason for the same is <break strength=\"medium\" /> '+body.result.currentClaimStatus+'.</s>');
                    speechOutput.push('<s> Once the invoice is submitted, it will take 5 working days for settlement.</s>');
                    resolve(speechOutput);
                }
            });
        })
    }
};