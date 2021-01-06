const winston = require('./utils/winston');

let express = require('express');
let bodyParser = require('body-parser');
const res = require("express");
let app = express();
let exec = require('child_process').exec;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/payload', function (req, res) {
    //verify that the payload is a push from the correct repo
    //verify repository.name == 'wackcoon-device' or repository.full_name = 'DanielEgan/wackcoon-device'
    winston.info(req.body.pusher.name + ' just pushed to ' + req.body.repository.name);

    winston.warn('pulling code from GitHub...');
    exec('git -C ~/Repos/Keystone reset --hard', execCallback);
    exec('git -C ~/Repos/Keystone  clean -df', execCallback);
    exec('git -C ~/Repos/Keystone  pull -f', execCallback);
    exec('npm -C ~/Repos/Keystone  install --production', execCallback);
    exec('tsc', execCallback);
});

app.get('/payload', function (req, res) {
    res.sendStatus(200);
    console.log('get /payload');
});

app.listen(9000, function () {
    winston.info('listening on port 9000')
});

function execCallback(err, stdout, stderr) {
    if(stdout) winston.info(stdout);
    if(stderr) winston.info(stderr);
}