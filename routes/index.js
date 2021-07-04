var express = require('express');
const https = require('https');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  let success = req.query.success !== undefined && req.query.success !== false
  getTeamInfo(data => {
    res.render('index', { title: data.team.name, icon: data.team.icon.image_230, success: success });
  }, error => {
    res.render('index', { title: 'ERROR', icon: 'images/error.png', success: false });
  });
});

function getTeamInfo(successCallback, errorCallback) {
  const options = {
    hostname: 'slack.com',
    port: 443,
    path: '/api/team.info?team=' + process.env.TEAM_ID,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`,
      'Content-Type': 'application/json; charset=utf-8'
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
  slackRequest.end();
}

module.exports = router;
