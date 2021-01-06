const winston = require('./utils/winston');

let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let exec = require('child_process').exec;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.htm');
    winston.info('get /');
});

app.get('/payload', function (req, res) {
    res.sendStatus(200);
    winston.info('get /payload');
});

app.post('/payload', function (req, res) {
    //verify that the payload is a push from the correct repo
    //verify repository.name == 'wackcoon-device' or repository.full_name = 'DanielEgan/wackcoon-device'
    winston.info(req.body.pusher.name + ' just pushed to ' + req.body.repository.name);

    winston.info('pulling code from GitHub...');

    // reset any changes that have been made locally
    exec('git -C ~/projects/wackcoon-device reset --hard', execCallback);

    // and ditch any files that have been added locally too
    exec('git -C ~/projects/wackcoon-device clean -df', execCallback);

    // now pull down the latest
    exec('git -C ~/projects/wackcoon-device pull -f', execCallback);

    // and npm install with --production
    exec('npm -C ~/projects/wackcoon-device install --production', execCallback);

    // and run tsc
    exec('tsc', execCallback);
});

app.listen(9000, function () {
    winston.info('listening on port 9000')
});

function execCallback(err, stdout, stderr) {
    if(stdout) winston.info(stdout);
    if(stderr) winston.info(stderr);
}