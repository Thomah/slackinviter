var express = require('express');
const https = require('https');

var router = express.Router();

/* GET users listing. */
router.post('/', function (req, res, next) {
  conversations_open(
    data => {
      chat_postMessage(
        data.channel.id,
        `A new user wishes to join the workspace : ${req.body.email}`,
        () => {
          res.redirect('/?success');
        },
        error => {
          console.log("Error: " + error.message);
          res.redirect('/');
        });
    },
    error => {
      console.log("Error: " + error.message);
      res.redirect('/');
    });
});

function conversations_open(successCallback, errorCallback) {
  const data = JSON.stringify({
    users: process.env.USERS_ID
  });
  sendSlackRequest('/api/conversations.open', data, successCallback, errorCallback)
}

function chat_postMessage(channel, text, successCallback, errorCallback) {
  const data = JSON.stringify({
    channel: channel,
    text: text
  });
  sendSlackRequest('/api/chat.postMessage', data, successCallback, errorCallback)
}

function sendSlackRequest(path, data, successCallback, errorCallback) {

  const options = {
    hostname: 'slack.com',
    port: 443,
    path: path,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`,
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': data.length
    }
  };

  const slackRequest = https.request(options, slackResponse => {
    let data = '';
    slackResponse.on('data', (chunk) => {
      data += chunk;
    });
    slackResponse.on('end', () => {
      successCallback(JSON.parse(data));
    });
  }).on("error", (error) => {
    errorCallback(error);
  });
  slackRequest.write(data);
  slackRequest.end();
}

module.exports = router;
