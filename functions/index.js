var request = require('request');
var config = require('./config');

function handleSlackRequest(err, slackResponse, slackBody, httpResponse) {
    if (err) {
        console.log(err);
        httpResponse.status(500).send(err);
    } else {
        var result = JSON.parse(slackBody);
        if (result.ok) {
            httpResponse.status(200).send('ok');
        } else {
            var error = result.error;
            console.log(error);
            switch (error) {
                case 'already_invited':
                    httpResponse.status(302).send(error);
                    break;
                case 'already_in_team':
                    httpResponse.status(302).send(error);
                    break;
                case 'invalid_email':
                    httpResponse.status(400).send(error);
                    break;
                case 'invalid_auth':
                    httpResponse.status(500).send(error);
                    break;
                default:
                    httpResponse.status(500).send(error);
                    break;
            }
        }
    }
}

exports.getSlackInvite = function getSlackInvite(req, res) {

    res.set('Content-Type', 'application/json');
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type');


    if (req.method == 'OPTIONS') {
        res.status(204).send('');
    } else if (req.method == 'POST') {

        if (req.body.email === undefined) {
            console.log('Missing email');
            res.status(400).send('Missing email');
        } else {
            console.log('Inviting ' + req.body.email);
            request.post({
                url: 'https://' + config.slackUrl + '/api/users.admin.invite',
                form: {
                    email: req.body.email,
                    token: config.slackToken,
                    set_active: true
                }
            }, function (error, slackResponse, body) {
                handleSlackRequest(error, slackResponse, body, res);
            });
        }
    } else {
        console.log('Invalid method');
        res.status('400'.send(''));
    }

};


