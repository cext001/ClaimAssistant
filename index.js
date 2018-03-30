const express = require('express'),
Alexa = require('alexa-app'),
bodyParser = require('body-parser'),
request = require('request'),
config = require('./config')

const app = express();
app.use(bodyParser.json());
CA = new Alexa.app('claimassistant');


app.get('/',(req,res)=>{
    res.send('App running');
});

app.post('/buddy',(req,res)=>{
    console.log('Req:',req.body.request.intent);
    //let intent = require('./'+req.body.request.intent.name);
    //intent.requestHandler(req,res);
})
const server = app.listen(process.env.PORT || 443, () => {
    console.log('Express server listening on port %d', server.address().port);
});

